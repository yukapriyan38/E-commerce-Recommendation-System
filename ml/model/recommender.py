import os

import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Load environment variables
load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".env"
    )
)

MONGO_URI = os.getenv("MONGO_URI")


# Connect to MongoDB
client = MongoClient(MONGO_URI)

# Get database name from MongoDB URI
db = client["E-commerce"]

products_collection = db["products"]


# Load products from MongoDB
products = list(
    products_collection.find()
)


if not products:
    raise Exception(
        "No products found in MongoDB"
    )


# Convert MongoDB documents to DataFrame
df = pd.DataFrame(products)


# Convert missing values to empty strings
for column in [
    "category",
    "brand",
    "description",
    "tags"
]:
    if column not in df.columns:
        df[column] = ""

    df[column] = df[column].fillna("")


# Convert tags array into text
df["tags"] = df["tags"].apply(
    lambda tags: " ".join(tags)
    if isinstance(tags, list)
    else str(tags)
)


# Create combined product features
df["features"] = (
    df["category"]
    + " "
    + df["brand"]
    + " "
    + df["description"]
    + " "
    + df["tags"]
)


# Convert product features into TF-IDF vectors
vectorizer = TfidfVectorizer(
    stop_words="english"
)

tfidf_matrix = vectorizer.fit_transform(
    df["features"]
)


# Calculate cosine similarity
similarity_matrix = cosine_similarity(
    tfidf_matrix
)


def get_recommendations(
    product_name,
    number_of_recommendations=5
):

    # Find product by name
    matches = df[
        df["name"].str.lower()
        == product_name.lower()
    ]

    if matches.empty:
        return []

    product_index = matches.index[0]

    # Get similarity scores
    similarity_scores = list(
        enumerate(
            similarity_matrix[product_index]
        )
    )

    # Sort by similarity
    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    # Remove the selected product itself
    similarity_scores = similarity_scores[1:]

    # Select top products
    top_products = similarity_scores[
        :number_of_recommendations
    ]

    recommendations = []

    for index, score in top_products:

        product = df.iloc[index]

        recommendations.append({
            "id": str(product["_id"]),
            "name": product["name"],
            "category": product["category"],
            "brand": product["brand"],
            "price": float(product["price"]),
            "similarity_score": round(
                float(score),
                4
            )
        })

    return recommendations


# Test
if __name__ == "__main__":

    product_name = "Cricket Bat"

    recommendations = get_recommendations(
        product_name,
        5
    )

    print(
        "\nRecommendations for:",
        product_name
    )

    print("-" * 50)

    for product in recommendations:

        print(
            f"{product['name']} "
            f"({product['category']}) "
            f"- similarity: "
            f"{product['similarity_score']}"
        )