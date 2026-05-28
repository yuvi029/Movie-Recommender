# Movie Recommender System

A content-based movie recommender built using the TMDB 5000 dataset.

## Tech Stack
Python | Pandas | Scikit-learn | NLTK | Pickle

## How it works
- Extracts features from genres, keywords, cast and director
- Applies Porter Stemming and CountVectorizer
- Computes cosine similarity across 4800+ movies
- Returns top 5 similar movies for any input