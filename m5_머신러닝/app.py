from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)

# 데이터 폴더 경로 설정
data_folder = 'ml-latest-small'

# 데이터 및 모델 로드
movies = pd.read_csv(os.path.join(data_folder, 'movies.csv'))
ratings = pd.read_csv(os.path.join(data_folder, 'ratings.csv'))
svd, knn = joblib.load('hybrid_model.joblib')

def hybrid_predict(uid, iid):
    svd_pred = svd.predict(uid, iid).est
    knn_pred = knn.predict(uid, iid).est
    return (svd_pred + knn_pred) / 2

def get_unseen_surprise(ratings, movies, userId):
    seen_movies = ratings[ratings['userId'] == userId]['movieId'].tolist()
    total_movies = movies['movieId'].tolist()
    unseen_movies = [movie for movie in total_movies if movie not in seen_movies]
    return unseen_movies

def recomm_movie_by_surprise(userId, unseen_movies, top_n=10):
    predictions = [hybrid_predict(str(userId), str(movieId)) for movieId in unseen_movies]
    
    top_predictions = sorted(zip(unseen_movies, predictions), key=lambda x: x[1], reverse=True)[:top_n]

    top_movie_ids = [int(movieId) for movieId, _ in top_predictions]
    top_movie_ratings = [rating for _, rating in top_predictions]
    top_movie_titles = movies[movies.movieId.isin(top_movie_ids)]['title']
    top_movie_preds = [(id, title, rating) for id, title, rating in zip(top_movie_ids, top_movie_titles, top_movie_ratings)]

    return top_movie_preds

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    user_id = int(request.form['user_id'])
    n = int(request.form['n'])
    
    unseen_movies = get_unseen_surprise(ratings, movies, user_id)
    top_movie_preds = recomm_movie_by_surprise(user_id, unseen_movies, top_n=n)
    
    results = []
    for movie_id, title, score in top_movie_preds:
        movie = movies[movies['movieId'] == movie_id].iloc[0]
        results.append({
            'title': title,
            'genres': movie['genres'],
            'score': round(score, 2)
        })
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)