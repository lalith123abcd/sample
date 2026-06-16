import re
import json

CHAT_FILE = "_chat.txt"
OUTPUT_FILE = "pandu_data.jsonl"
USER = "Lalith"
PANDU = "Buddankay"

# Pattern designed to handle timestamps, hidden spaces, and non-breaking Unicode characters
# The \u202f is the non-breaking narrow space often found in iPhone/WhatsApp exports
pattern = re.compile(r"^\[.*?\]\s*(.*?):\s*(.*)$")

messages = []
current_msg = None

with open(CHAT_FILE, "r", encoding="utf-8-sig") as f: # utf-8-sig handles BOM
    for line in f:
        # Clean the line by removing invisible non-breaking spaces
        clean_line = line.replace('\u202f', ' ').strip()
        if not clean_line: continue
        
        match = pattern.match(clean_line)
        if match:
            if current_msg:
                messages.append(current_msg)
            sender, text = match.groups()
            current_msg = {"sender": sender.strip(), "text": text.strip()}
        else:
            # If the line doesn't match the pattern, it's a continuation of the previous message
            if current_msg:
                current_msg["text"] += " " + clean_line

    if current_msg:
        messages.append(current_msg)

# Filtering and Pairing
pairs = []
skip_phrases = ["image omitted", "video omitted", "sticker omitted", "deleted this message", "http"]

for i in range(len(messages) - 1):
    curr = messages[i]
    nxt = messages[i + 1]

    # Matching logic: USER must send the input, PANDU must send the output
    if curr["sender"] == USER and nxt["sender"] == PANDU:
        text_in = curr["text"]
        text_out = nxt["text"]
        
        if len(text_in) < 2 or len(text_out) < 2: continue
        if any(s in text_in.lower() or s in text_out.lower() for s in skip_phrases): continue
        
        pairs.append({"input": text_in, "output": text_out})

# Remove Duplicates
seen = set()
cleaned = []
for p in pairs:
    key = (p["input"].lower(), p["output"].lower())
    if key not in seen:
        seen.add(key)
        cleaned.append(p)

# Save to file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    for p in cleaned:
        f.write(json.dumps(p, ensure_ascii=False) + "\n")

print(f"Successfully created {len(cleaned)} training pairs.")