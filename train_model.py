import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import pickle
import json

# Load dataset
df = pd.read_csv('kiran_dataset.csv')
print(f"Dataset loaded: {len(df)} rows")
print(df.head())

# ── Model 1: Anger Level Predictor ──
print("\nTraining Anger Level Model...")
X_anger = df['situation']
y_anger = df['anger_level']

anger_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=500)),
    ('model', RandomForestClassifier(n_estimators=100, random_state=42))
])
anger_pipeline.fit(X_anger, y_anger)
print("Anger model trained!")

# ── Model 2: Block Days Predictor ──
print("\nTraining Block Days Model...")
X_block = df['situation']
y_block = df['block_days']

block_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=500)),
    ('model', RandomForestClassifier(n_estimators=100, random_state=42))
])
block_pipeline.fit(X_block, y_block)
print("Block days model trained!")

# ── Model 3: Advice + Punishment (rule-based from CSV) ──
# Store as lookup dictionary for exact matching
advice_lookup = {}
for _, row in df.iterrows():
    advice_lookup[row['situation'].lower()] = {
        'advice': row['advice'],
        'punishment': row['punishment'],
        'trigger_type': row['trigger_type'],
        'severity': row['severity']
    }

# Save models
with open('anger_model.pkl', 'wb') as f:
    pickle.dump(anger_pipeline, f)

with open('block_model.pkl', 'wb') as f:
    pickle.dump(block_pipeline, f)

with open('advice_lookup.json', 'w') as f:
    json.dump(advice_lookup, f, indent=2)

print("\nAll models saved!")
print("Files created:")
print("  anger_model.pkl")
print("  block_model.pkl")
print("  advice_lookup.json")

# Test prediction
test_input = "He called me Pandu"
anger_pred = anger_pipeline.predict([test_input])[0]
block_pred = block_pipeline.predict([test_input])[0]
print(f"\nTest: '{test_input}'")
print(f"  Anger Level: {anger_pred}%")
print(f"  Block Days: {block_pred} days")
