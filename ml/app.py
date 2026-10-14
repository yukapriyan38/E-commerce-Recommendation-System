from flask import Flask, jsonify
from model.personalized_recommender import get_personalized_recommendations

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Recommendation ML API is running"
    }), 200


@app.route("/recommendations/<user_id>", methods=["GET"])
def recommendations(user_id):
    try:
        results = get_personalized_recommendations(user_id)

        return jsonify({
            "userId": user_id,
            "count": len(results),
            "recommendations": results
        }), 200

    except ValueError as error:
        return jsonify({
            "message": str(error)
        }), 400

    except Exception:
        app.logger.exception("Recommendation API failed")

        return jsonify({
            "message": "Failed to generate recommendations"
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=False
    )