
import os
from collections import defaultdict

import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Load MongoDB configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is missing from ml/.env")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["E-commerce"]

products_collection = db["products"]
interactions_collection = db["interactions"]


# Interaction weights: starting heuristic values
WEIGHTS = {
    "view": 1.0,
    "search": 2.0,
    "add_to_cart": 3.0,
    "remove_from_cart": -2.0,
    "purchase": 5.0,
}


def load_products():
    products = list(products_collection.find())

    if not products:
        raise ValueError("No products found in MongoDB.")

    df = pd.DataFrame(products)

    for column in ["name", "category", "brand", "description", "tags"]:
        if column not in df.columns:
            df[column] = ""

        df[column] = df[column].fillna("")

    df["tags"] = df["tags"].apply(
        lambda value: " ".join(map(str, value))
        if isinstance(value, list)
        else str(value)
    )

    # Product text used to calculate content similarity
    df["features"] = (
        df["name"].astype(str) + " "
        + df["category"].astype(str) + " "
        + df["brand"].astype(str) + " "
        + df["description"].astype(str) + " "
        + df["tags"].astype(str)
    )

    return df


def build_model(df):
    vectorizer = TfidfVectorizer(stop_words="english")

    product_matrix = vectorizer.fit_transform(df["features"])

    similarity_matrix = cosine_similarity(product_matrix)

    return vectorizer, product_matrix, similarity_matrix


def get_personalized_recommendations(user_id, limit=5):
    """
    Recommend products based on a user's interaction history.

    user_id must be the MongoDB User _id as a string.
    """

    df = load_products()
    vectorizer, product_matrix, similarity_matrix = build_model(df)

    # Validate the user ID
    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        raise ValueError("Invalid MongoDB user ID.")

    interactions = list(
        interactions_collection.find({"user": user_object_id})
        .sort("createdAt", -1)
    )

    # If the user has no history, return popular products as fallback.
    # Here, rating is used only as a simple fallback ranking.
    if not interactions:
        fallback = df.sort_values(
            by="rating", ascending=False
        ).head(limit)

        return [
            {
              
    "id": str(row["_id"]),
    "name": row["name"],
    "category": row["category"],
    "brand": row["brand"],
    "price": float(row["price"]),
    "rating": row.get("rating", "N/A"),
    "image": row.get("image", ""),
    "score": 0.0,
    "reason": "Popular product fallback"
            }
            for _, row in fallback.iterrows()
        ]

    # Build a weighted profile from products the user interacted with.
    profile = None
    interacted_product_ids = set()
    search_queries = []

    for interaction in interactions:
        interaction_type = interaction.get("type", "")
        weight = WEIGHTS.get(interaction_type, 0.0)

        if interaction_type == "search":
            query = str(interaction.get("searchQuery", "")).strip()
            if query:
                search_queries.append((query, weight))
            continue

        product_id = interaction.get("product")

        if not product_id or weight == 0:
            continue

        matching_rows = df.index[
            df["_id"].astype(str) == str(product_id)
        ].tolist()

        if not matching_rows:
            continue

        index = matching_rows[0]
        interacted_product_ids.add(str(product_id))

        # Add or subtract this product's feature vector.
        vector = product_matrix[index] * weight

        if profile is None:
            profile = vector.copy()
        else:
            profile = profile + vector

    # Search terms also contribute to the user profile.
    for query, weight in search_queries:
        query_vector = vectorizer.transform([query])
        profile_part = query_vector * weight

        if profile is None:
            profile = profile_part.copy()
        else:
            profile = profile + profile_part

    # A profile can be empty if history contains no usable products/terms.
    if profile is None or profile.nnz == 0:
        fallback = df.sort_values(
            by="rating", ascending=False
        ).head(limit)

        return [
            {
              {
    "id": str(row["_id"]),
    "name": row["name"],
    "category": row["category"],
    "brand": row["brand"],
    "price": float(row["price"]),
    "rating": row.get("rating", "N/A"),
    "image": row.get("image", ""),
    "score": 0.0,
    "reason": "Popular product fallback"
}
            }
            for _, row in fallback.iterrows()
        ]

    # Compare the user profile with every product.
    scores = cosine_similarity(profile, product_matrix).flatten()

    # Do not recommend products the user already purchased.
    purchased_ids = set()

    for interaction in interactions:
        if interaction.get("type") == "purchase":
            product_id = interaction.get("product")
            if product_id:
                purchased_ids.add(str(product_id))

    df = df.copy()
    df["score"] = scores

    recommendations = []

    # Sort by relevance and skip already purchased products.
    ranked = df.sort_values("score", ascending=False)

    for _, row in ranked.iterrows():
        product_id = str(row["_id"])

        if product_id in purchased_ids:
            continue

        # Exclude products with no positive relevance.
        if row["score"] <= 0:
            continue

        recommendations.append({
        
    "id": product_id,
    "name": row["name"],
    "category": row["category"],
    "brand": row["brand"],
    "price": float(row["price"]),
    "rating": row.get("rating", "N/A"),
    "image": row.get("image", ""),
    "score": round(float(row["score"]), 4),
    "reason": "Based on your activity"

        })

        if len(recommendations) >= limit:
            break

    return recommendations


if __name__ == "__main__":
    user_id = input("Enter MongoDB user ID: ").strip()

    try:
        results = get_personalized_recommendations(user_id)

        print("\nPersonalized recommendations")
        print("-" * 45)

        if not results:
            print("No relevant products found.")
        else:
            for number, item in enumerate(results, start=1):
                print(
                    f"{number}. {item['name']} "
                    f"({item['category']}) | "
                    f"Score: {item['score']} | "
                    f"{item['reason']}"
                )

    except Exception as error:
        print("Recommendation error:", error)

    finally:
        client.close()
