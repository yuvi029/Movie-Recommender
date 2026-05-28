from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load movies and recalculate similarity
print("Loading model...")
movies = pickle.load(open('movie_list.pkl', 'rb'))

cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(movies['tags']).toarray()
similarity = cosine_similarity(vectors)
print("Model ready!")

@app.get("/movies")
def get_movies():
    return {"movies": movies['title'].tolist()}

@app.get("/recommend")
def recommend(movie: str):
    idx   = movies[movies['title'] == movie].index[0]
    dists = similarity[idx]
    top5  = sorted(list(enumerate(dists)), reverse=True, key=lambda x: x[1])[1:6]
    return {"movies": [movies.iloc[i[0]].title for i in top5]}