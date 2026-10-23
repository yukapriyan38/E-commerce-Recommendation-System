import logging

import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from model.personalized_recommender import get_personalized_recommendations

app = FastAPI()
logger = logging.getLogger(__name__)


@app.get("/")
def home():
    return {"message": "AI Recommendation ML API is running"}


@app.get("/recommendations/{user_id}")
def recommendations(user_id):
    try:
        results = get_personalized_recommendations(user_id)

        return {
            "userId": user_id,
            "count": len(results),
            "recommendations": results
        }

    except ValueError as error:
        return JSONResponse(
            status_code=400,
            content={"message": str(error)}
        )

    except Exception:
        logger.exception("Recommendation API failed")

        return JSONResponse(
            status_code=500,
            content={"message": "Failed to generate recommendations"}
        )


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=5001,
    )