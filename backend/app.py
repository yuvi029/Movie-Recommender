from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle

app = FastAPI()

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your saved model
movies     = pickle.load(open('movie_list.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))

# Get all movie titles (for search dropdown)
@app.get("/movies")
def get_movies():
    return {"movies": movies['title'].tolist()}

# Get recommendations
@app.get("/recommend")
def recommend(movie: str):
    idx   = movies[movies['title'] == movie].index[0]
    dists = similarity[idx]
    top5  = sorted(list(enumerate(dists)), reverse=True, key=lambda x: x[1])[1:6]
    return {"movies": [movies.iloc[i[0]].title for i in top5]}