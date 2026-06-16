from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import json
import os

app = Flask(__name__)
CORS(app)

# Load models
with open('anger_model.pkl', 'rb') as f:
    anger_model = pickle.load(f)
try:
    with open("pandu_data.jsonl", encoding="utf-8") as f:
        pandu_data = [json.loads(line) for line in f]
except FileNotFoundError:
    pandu_data = []
    print("⚠️ pandu_data.jsonl not found")
    
with open('block_model.pkl', 'rb') as f:
    block_model = pickle.load(f)

with open('advice_lookup.json', 'r') as f:
    advice_lookup = json.load(f)


@app.route('/chat-pandu', methods=['POST'])
def chat_pandu():

    data = request.get_json()
    message = data.get('message', '').lower().strip()

    for item in pandu_data:
        if item["input"].lower() in message:
            return jsonify({
                "reply": item["output"]
            })

    return jsonify({
        "reply": "Cheppu 😄"
    })
    
    
def get_advice_and_punishment(situation):
    """Find best matching advice from lookup"""
    situation_lower = situation.lower()
    
    # Direct match
    if situation_lower in advice_lookup:
        return advice_lookup[situation_lower]
    
    # Keyword matching
    keywords = {
        'pandu': 'He called me Pandu',
        'buddankay': 'He called me Buddankay',
        '88': 'He called me 88',
        'donkey': 'He called me Donkey',
        'monkey': 'He called me Monkey',
        'kukka': 'He called me Kukka',
        'idiot': 'He called me idiot',
        'stupid': 'He called me stupid',
        'prabhas': 'He said something bad about Prabhas',
        'rcb': 'He trolled RCB',
        'sleep': 'He called me when I was sleeping',
        'spam': 'He sent 50 messages in a row',
        'sorry': 'He said sorry but not sincerely',
        'unblock': 'Should I unblock him',
        'irritat': 'He is irritating me',
        'annoy': 'He is annoying me',
        'ignore': 'He left me on seen for hours',
        'lie': 'He lied to me',
        'voice': 'He made fun of my voice',
        'angry': 'He said I am angry all the time',
    }
    
    for keyword, lookup_key in keywords.items():
        if keyword in situation_lower:
            return advice_lookup.get(lookup_key.lower(), None)
    
    # Default response
    return {
        'advice': 'Block him for 1 day and make him think about what he did 😤',
        'punishment': '100 sorries + 10 situps',
        'trigger_type': 'general',
        'severity': 5
    }

@app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'KiranAI Model is running! 👑'})


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    situation = data.get('situation', '').strip()

    if not situation:
        return jsonify({'error': 'No situation provided'}), 400

    situation_lower = situation.lower()

    # ---------- Rule-based overrides ----------

    # Unblock requests
    if "unblock" in situation_lower:
        return jsonify({
            'situation': situation,
            'anger_level': 25,
            'block_probability': 15,
            'block_days': 0,
            'danger': "🟢 LOW DANGER",
            'advice': "Give him one more chance only if he genuinely changed 🙂",
            'punishment': "10 sorries",
            'severity': 3,
        })

    # Bored situations
    if "bored" in situation_lower:
        return jsonify({
            'situation': situation,
            'anger_level': 10,
            'block_probability': 5,
            'block_days': 0,
            'danger': "🟢 LOW DANGER",
            'advice': "Block him for 10 minutes and go watch reels 😂",
            'punishment': "Take a 5-minute break",
            'severity': 1,
        })

    # Mild insults
    mild_insults = [
        "idiot",
        "stupid",
        "nonsense",
        "waste fellow",
        "overaction",
        "comedy piece",
        "pilla nibba"
    ]

    if any(word in situation_lower for word in mild_insults):
        lookup = get_advice_and_punishment(situation)

        return jsonify({
            'situation': situation,
            'anger_level': 85,
            'block_probability': 90,
            'block_days': 2,
            'danger': "🔴 EXTREME DANGER",
            'advice': lookup['advice'] if lookup else 'Handle mild_insult appropriately 😤',
            'punishment': lookup['punishment'] if lookup else '20 sit-ups',
            'severity': lookup['severity'] if lookup else 9,
        })

    # ---------- ML Predictions ----------

    anger_level = int(anger_model.predict([situation])[0])
    block_days = int(block_model.predict([situation])[0])

    lookup = get_advice_and_punishment(situation)

    block_probability = min(99, anger_level + 5)

    if anger_level >= 80:
        danger = "🔴 EXTREME DANGER"
    elif anger_level >= 60:
        danger = "🟠 HIGH DANGER"
    elif anger_level >= 40:
        danger = "🟡 MEDIUM DANGER"
    else:
        danger = "🟢 LOW DANGER"

    return jsonify({
        'situation': situation,
        'anger_level': anger_level,
        'block_probability': block_probability,
        'block_days': block_days,
        'danger': danger,
        'advice': lookup['advice'] if lookup else 'Block him 😤',
        'punishment': lookup['punishment'] if lookup else '20 sit-ups',
        'severity': lookup['severity'] if lookup else 5,
    })


@app.route('/check-message', methods=['POST'])
def check_message():
    """Lalith mode - check if message is safe to send"""
    data = request.get_json()
    message = data.get('message', '')
    
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    
    msg_lower = message.lower()
    
    # Calculate danger score
    danger_score = 0
    warnings = []
    danger_words = {
    'pandu': (40, "🚨 'Pandu' will get you blocked instantly!"),
    'buddankay': (40, "🚨 'Buddankay' = instant block!"),
    

    'donkey': (35, "🚨 Calling names = block!"),
    'monkey': (35, "🚨 Calling names = block!"),
    'kukka': (40, "🚨 This word = instant block!"),

    'idiot': (45, "⚠️ Calling her 'idiot' will make her angry!"),
    'stupid': (45, "⚠️ Calling her 'stupid' will make her angry!"),
    'nonsense': (45, "⚠️ Calling her 'nonsense' is disrespectful!"),
    'waste fellow': (50, "🚨 Insults may lead to a block!"),
    'overaction': (35, "⚠️ Mocking her will upset her!"),
    'comedy piece': (35, "⚠️ Sarcastic nicknames are risky!"),
    'pilla nibba': (50, "🚨 Name-calling may lead to a block!"),

    'prabhas': (45, "💀 Mentioning Prabhas negatively = 7 day block!"),
    'rcb': (25, "⚠️ RCB topic is risky!"),

    'pilli': (35, "🚨 Name calling = block!"),
    'bothu': (35, "🚨 Name calling = block!")
}
    safe_words = {
        'sorry': -20,
        'please': -10,
        'pls': -10,
        'love': -15,
        'friend': -10,
        'miss': -5,
    }
    
    for word, (score, warning) in danger_words.items():
        if word in msg_lower:
            danger_score += score
            warnings.append(warning)
    
    for word, score in safe_words.items():
        if word in msg_lower:
            danger_score += score
    
    danger_score = max(0, min(100, danger_score))
    
    # Predict her possible replies
    if danger_score >= 80:
        replies = [
            "Champa pagulthadi 😡",
            "BLOCKED. Don't ever text again 💀",
            "Nuvvu chaala worst unav!"
        ]
        safe_to_send = False
        verdict = "🔴 DELETE THIS MESSAGE!"
    elif danger_score >= 50:
        replies = [
            "Enti ee attitude 😤",
            "Block chestha wait chey",
            "I am not gonna talk anymore. Bye."
        ]
        safe_to_send = False
        verdict = "🟠 RISKY - Think twice!"
    elif danger_score >= 20:
        replies = [
            "Hmm 😒",
            "Ok fine",
            "..."
        ]
        safe_to_send = True
        verdict = "🟡 OKAY but be careful"
    else:
        replies = [
            "Hi 😊",
            "Chepu em chestunavv",
            "Sare 😂"
        ]
        safe_to_send = True
        verdict = "🟢 SAFE TO SEND!"
    
    return jsonify({
        'message': message,
        'danger_score': danger_score,
        'safe_to_send': safe_to_send,
        'verdict': verdict,
        'warnings': warnings,
        'predicted_replies': replies,
        'block_probability': min(99, danger_score + 5)
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
