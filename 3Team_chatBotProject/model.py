from pymongo import MongoClient
from config import MONGO_URI, MONGO_DBNAME
from datetime import datetime
import pytz

def get_mongo_client():
  uri = MONGO_URI
  db_name = MONGO_DBNAME
  client = MongoClient(uri)
  db = client[db_name]

  return db

def get_all_contents():
  db = get_mongo_client()
  collection = db['team3']
  
  documents = collection.find({}, {"_id": 0, "content": 1})

  return [doc['content'] for doc in documents]

def save_data_to_db(user_id, user, ai):
  db = get_mongo_client()
  collection = db['team3']
  collection.insert_one({"user_id":user_id, "user": user, "ai": ai, "datetime":datetime.now(pytz.timezone('Asia/Seoul'))})

def get_user_chat_history(user_id):
  db = get_mongo_client()
  collection = db['chat_history']

  history = collection.find({"user_id": user_id},{"chat":1, "_id": 0})
  chat_history = []
  for doc in history:
    chat_history.append(doc.get('chat', []))
  return chat_history