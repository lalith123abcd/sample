import { useState, useRef, useEffect } from "react";

// ══════════════════════════════════════════
// BUILT-IN DATA — no JSON file needed!
// ══════════════════════════════════════════
const kiranData = {
  keyword_replies: {
    'good morning': ["Good morning 😌", "Ha good morning", "Nidraosthundi bye 😴", "Ippude lecha 😒", "Ha 😌"],
    'good night':   ["Good night 😴", "Ha gn", "Paduko ika 😒", "Bye gn 😴"],
    'sorry':        ["Sare ok 😒", "Inkaite repeat cheyyaku", "Ha fine 😒", "Ok but inkaite block chestha", "...", "Kshmistha 😌 Inkaite repeat cheyyaku"],
    'hi':           ["Ha chepu 😏", "Ha enti", "Chepu", "Ha", "Enti 😒"],
    'how are you':  ["Fine 😒", "Ha bavundi", "Ok 😒", "Bavundi chepu enti", "😒"],
    'lunch':        ["Ha tinna", "Ledu inka", "Thinava nuvvu", "Ha chepu"],
    'dinner':       ["Ha tinna", "Ledu inka 😒", "Thinava nuvvu"],
    'sleep':        ["Nidraosthundi bye 😴", "Ha padukunta", "Padukovalani undi 😒", "Bye nidra osthundi"],
    'prabhas':      ["KING OF INDIAN CINEMA 👑", "Ha nijame 😌", "Prabhas best 😍", "Finally correct ga cheppav 😏"],
    'rcb':          ["RCB best team 😤", "Ha RCB wins chestha 😤"],
    'pandu':        [["Champa pagulthadi", "Block chestha wait chey 😤"], ["Enti ee perlu 😤", "Sorry chepu ippude"], ["...", "Block"], ["Idiot", "Pandu ani ela antav", "Chasthav 😡"]],
    'idiot':        ["Nuvve idiot 😤", "Chasthav", "Block chestha", "Champa pagulthadi 😡"],
    'block':        ["Block chestha chusko 😏", "Done block 😤", "Bye blocked", "Ikkade block chestha"],
    'miss you':     ["Ha naku kuda 😌", "Ha miss avutunna", "Ok 😒", "Hmm"],
    'love':         ["Ha 😌", "Ok 😒", "Hmm", "Naku kuda 😌"],
    'angry':        ["Kopam vasthundi 😤", "Emi chesav inka", "Champa pagulthadi", "😤"],
    'punishment':   [["Sorry chepu 20 times", "Chepu anna"], ["20 situps chey mundu", "Video record chesi pampinchu"], ["1000 times sorry chepu", "Chepu ika"]],
    'bye':          ["Bye 😒", "Bye bye", "Ha bye", "Bye 😏"],
    'ok':           ["Ok 😒", "Ha ok", "Sare", "Fine 😒"],
    'why':          ["Enduku antav 😤", "Na reason naku telusunu", "Nuvve cheppav 😒"],
    'call':         ["Ela cut chesav call 😤", "Call chestha wait chey", "Ok chestha"],
    'cute':         ["Ha 😌", "😊", "Ok 😏", "Ha telusunu 😌"],
    'please':       ["Please ela antav 😒", "Sare fine 😒", "Ha ok", "Kshmistha 😌"],
    'bored':        ["Naku kuda bore avuthundi 😒", "Ha emi cheyanu", "Matladamandi ika 😒"],
    'thanks':       ["Ha 😌", "Ok 😒", "Welcome kadu 😏", "Ha fine"],
    'no':           ["Ledhu ante ledhu 😤", "No means no 😒", "Sare fine bye"],
    'bad':          ["Nuvve bad person 😤", "Champa pagulthadi", "Chasthav 😡"],
    'good':         ["Ha bavundi 😌", "Ok good", "😊"],
    'fight':        ["Nuvve start chesav 😤", "Emi chesav inka", "Block chestha bye"],
    'cat':          [["Champa pagulthadi 😡", "Ika anaku"], ["Idiot", "Cat ani ela antav", "Block chestha"], ["...", "Chasthav", "Bye"]],
    'talk':         ["Ha matladanidi emundi 😒", "Chepu enti", "Ha cheppandi"],
  },
  all_kiran_messages: [
    "Ha chepu 😏","Bye 😒","Champa pagulthadi 😡","Idiot","Block chestha",
    "Chasthav","...","Sorry chepu","Ok 😒","Ha bavundi","Fine 😒","Sare",
    "Nuvve idiot 😤","Ha ok","Hmm","😒","😤","😡","Ha 😌","Bye bye","Ledu",
    "Ok fine 😒","Na mood bavundi","Emi chesav inka 😤","Good morning 😌",
    "Good night 😴","Ha nidra vasthundi bye","KING OF INDIAN CINEMA 👑",
    "RCB best team 😤","Ha nijame 😌","Naku kuda 😌","Kshmistha 😌 Inkaite repeat cheyyaku",
    "20 situps chey","Block cheyanu anukuntunava 😏","Anitilo block aa chusko 😏",
    "Ha tinna","Bavundi chepu","Nuvve start chesav 😤","Na reason naku telusunu 😒",
    "Matladamandi ika","Pandu ani ela antav 😤","Ha miss avutunna 😌",
    "Ok but inkaite block chestha","Inkaite repeat cheyyaku 😒",
  ],
};

// ══════════════════════════════════════════
// KEYWORD MAP
// ══════════════════════════════════════════
const KEYWORDS_MAP = {
  'good morning': ['good morning','morning','gm','gudmorning'],
  'good night':   ['good night','night','gn','gudnight'],
  'sorry':        ['sorry','sori','sorryy','sorryyy','sory'],
  'hi':           ['hi','hii','hiii','hey','hello','hlo','hai'],
  'how are you':  ['how are you','how r u','how ru','wassup','sup','howru'],
  'lunch':        ['lunch','ate','thinava','food','tinava'],
  'dinner':       ['dinner','thinava','thinnava'],
  'sleep':        ['sleep','nidra','paduko','sleeping'],
  'prabhas':      ['prabhas','salaar','kalki','bahubali','darling'],
  'rcb':          ['rcb','royal challengers','virat'],
  'pandu':        ['pandu','buddankay','88','kukka','donkey','monkey','pilli','bothu'],
  'idiot':        ['idiot','stupid','nonsense','waste','dumb','fool','moron','pagal','shut up','worst','pathetic','bakwas'],
  'block':        ['block','unblock','blocked'],
  'miss you':     ['miss you','miss u','missing you','missing u'],
  'love':         ['love','luv','i love'],
  'angry':        ['angry','kopam','mad','anger','furious'],
  'punishment':   ['punishment','punish','situps','pushups','penalty'],
  'bye':          ['bye','byee','byyyy','goodbye','good bye','cya'],
  'ok':           ['ok ','okay','okk',' ok'],
  'why':          ['why','enduku','reason'],
  'call':         ['call','calling','phone','ring'],
  'cute':         ['cute','pretty','beautiful','gorgeous'],
  'please':       ['please','pls','plz','plss'],
  'bored':        ['bored','boring','bore','nothing to do'],
  'thanks':       ['thanks','thank you','ty','thankyou'],
  'no':           ['no please','please no','nope','nahi','ledhu'],
  'bad':          ['bad','worst person','terrible'],
  'good':         ['good job','well done','nice','great','superb'],
  'fight':        ['fight','quarrel','argument'],
  'cat':          ['cat','kitty','meow'],
  'talk':         ['talk to me','matladam','speak'],
};

const ANGER_TRIGGERS = {
  pandu:40, buddankay:42, kukka:40, donkey:35, monkey:33,
  idiot:30, stupid:28, nonsense:28, waste:25, 'shut up':38,
  ugly:40, fat:42, worst:28, pathetic:28, dumb:30,
  moron:30, fool:25, pagal:30, bakwas:25, loser:30,
  mad:22, crazy:25, psycho:35, whatever:28, boring:20,
  'go away':30, useless:30, worthless:35, rude:22,
  cat:25, kitty:28,
};

const CALM_TRIGGERS = {
  sorry:-20, please:-12, pls:-10, forgive:-18,
  'i was wrong':-22, 'my mistake':-20, love:-15,
  'i love you':-25, miss:-10, cute:-5, sweet:-8,
  beautiful:-10, 'thank you':-8, thanks:-8,
};

const SPECIAL_REPLIES = {
  prabhas_angry: [
    ["Chasthav","Ni moham le","KING OF INDIAN CINEMA"],
    ["Idiot","Ni lanti chetha idiots ala chepukuntunaru","Ni moham le vellu"],
    ["Champa pagulthadi 😡","Prabhas gurinchi ala cheppav?!","Bye bye bye"],
    ["Muthi pagilidhi","Chasthav nuvvu","Vellu ikkadi nundi"],
  ],
  pandu_called: [
    ["Champa pagulthadi","Block chestha wait chey 😤"],
    ["Enti ee perlu 😤","Block cheyanu anukuntunava","Sorry chepu ippude"],
    ["...","Block","Bye"],
    ["Idiot","Pandu ani ela antav","Chasthav 😡"],
  ],
  cut_call: [
    ["Ela cut chesav call","Punishment anthe","20 situps cheyu"],
    ["Call cut chesav?!","Sorry chepu","Ika cheyaku"],
    ["...","Champa pagulthadi","Sorry chepu ippude"],
  ],
  blocking: [
    ["Block chestha","Bye","Bye","Bye 😤"],
    ["Anitilo block aa","Chusko 😏"],
    ["Bye","Bye","Bye","Bye","Bye 😏"],
    ["Done matladatam","Block 😤"],
  ],
  forgive: [
    ["Kshmistha 😌","Inkaite repeat cheyyaku"],
    ["Sare ok","Mari repeat cheyyaku"],
    ["Na mood bavundi bathikipoyav 😏"],
    ["Ok fine 😒","But inkaite block chestha"],
  ],
  punishment: [
    ["Sorry chepu 20 times","Chepu anna"],
    ["Letter rasi pettu","Pen paper lo","Nvu own ga rasi pettu - Chatgpt lu isthe champutha 😤"],
    ["Punishment anthe","2 days matladatha","Bye"],
    ["20 situps chey mundu","Video record chesi pampinchu"],
    ["1000 times sorry chepu","Chepu ika"],
  ],
};

function detectAnger(message) {
  const msg = message.toLowerCase();
  let score = 0;
  for (const [word, pts] of Object.entries(ANGER_TRIGGERS)) {
    if (msg.includes(word)) score += pts;
  }
  for (const [word, pts] of Object.entries(CALM_TRIGGERS)) {
    if (msg.includes(word)) score += pts;
  }
  return Math.max(0, Math.min(100, score));
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getSmartReply(userMessage, angerLevel) {
  const msg = userMessage.toLowerCase().trim();

  // Prabhas insult
  if ((msg.includes('prabhas')||msg.includes('salaar')||msg.includes('kalki')) &&
      (msg.includes('bad')||msg.includes('worst')||msg.includes('ugly')||msg.includes('overrated')||msg.includes('flop')||msg.includes('boring')||msg.includes('hate'))) {
    return rand(SPECIAL_REPLIES.prabhas_angry);
  }
  // Prabhas positive
  if (msg.includes('prabhas') && (msg.includes('best')||msg.includes('good')||msg.includes('love')||msg.includes('king'))) {
    return [rand(["Ha nijame 😌","KING OF INDIAN CINEMA 👑","Finally correct ga cheppav 😏"])];
  }
  // Called pandu
  if (['pandu','buddankay','88','kukka','donkey','monkey','pilli','bothu','mondi'].some(n => msg.includes(n))) {
    return rand(SPECIAL_REPLIES.pandu_called);
  }
  // Cat
  if (msg.includes('cat')||msg.includes('kitty')||msg.includes('meow')) {
    return rand([["Champa pagulthadi 😡","Ika anaku"],["Idiot","Cat ani ela antav","Block chestha"],["...","Chasthav","Bye"]]);
  }
  // Cut call
  if ((msg.includes('cut')&&msg.includes('call'))||msg.includes('disconnect')) {
    return rand(SPECIAL_REPLIES.cut_call);
  }
  // Forgive
  if ((msg.includes('sorry')||msg.includes('forgive')||msg.includes('please')) && angerLevel < 30) {
    return rand(SPECIAL_REPLIES.forgive);
  }
  // Punishment
  if (msg.includes('punishment')||msg.includes('situp')||msg.includes('pushup')) {
    return rand(SPECIAL_REPLIES.punishment);
  }
  // RCB troll
  if (msg.includes('rcb')&&(msg.includes('bad')||msg.includes('lose')||msg.includes('worst')||msg.includes('flop'))) {
    return rand([
      ["Champa pagulthadi 😤","RCB gurinchi ala cheppaku","Block chestha"],
      ["Idiot","RCB best team 😤","Chasthav"],
      ["...","RCB troll chestav?","Bye 2 days"],
    ]);
  }

  // Keyword matching
  for (const [keyword, variants] of Object.entries(KEYWORDS_MAP)) {
    if (variants.some(v => msg.includes(v))) {
      const replies = kiranData.keyword_replies[keyword];
      if (replies && replies.length > 0) {
        const picked = rand(replies);
        return typeof picked === 'string' ? [picked] : picked;
      }
    }
  }

  // Fallback based on anger
  const allMsgs = kiranData.all_kiran_messages;
  if (angerLevel > 70) {
    const angry = allMsgs.filter(m => ['bye','champa','idiot','block','chasthav','...','sorry chepu','waste','pagulthadi'].some(w => m.toLowerCase().includes(w)));
    if (angry.length) return [rand(angry)];
  }
  if (angerLevel < 20) {
    const happy = allMsgs.filter(m => ['😂','ha','ok','sare','😌','good','😊','nice'].some(w => m.toLowerCase().includes(w)));
    if (happy.length) return [rand(happy)];
  }
  return [rand(allMsgs)];
}

// ══════════════════════════════════════
// STYLES
// ══════════════════════════════════════
const styles = {
  container: {
    minHeight:"100vh", background:"linear-gradient(135deg, #0a0f1a 0%, #0f1525 100%)",
    display:"flex", justifyContent:"center", alignItems:"center",
    fontFamily:"'Segoe UI', Arial, sans-serif",
  },
  phone: {
    width:"100%", maxWidth:"420px", height:"100vh", maxHeight:"850px",
    background:"#111827", display:"flex", flexDirection:"column",
    overflow:"hidden", border:"1px solid #1f2937",
  },
  header: {
    background:"linear-gradient(135deg, #1e3a5f, #1a2f4e)", padding:"12px 16px",
    display:"flex", alignItems:"center", gap:"12px",
    borderBottom:"1px solid #1f2937", flexShrink:0,
  },
  avatar: {
    width:"42px", height:"42px", borderRadius:"50%",
    background:"linear-gradient(135deg, #3b82f6, #1d4ed8)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:"1.3rem", flexShrink:0,
  },
  angerBar: {
    padding:"5px 16px", background:"#0f172a",
    display:"flex", alignItems:"center", gap:"8px",
    borderBottom:"1px solid #1f2937", flexShrink:0,
  },
  chatArea: { flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:"2px" },
  bubbleKiran: {
    alignSelf:"flex-start", background:"#1e3a5f",
    borderRadius:"14px 14px 14px 4px", padding:"8px 12px",
    maxWidth:"78%", fontSize:"0.88rem", color:"#e2e8f0", lineHeight:"1.4", marginBottom:"1px",
  },
  bubbleUser: {
    alignSelf:"flex-end", background:"#1f4d2e",
    borderRadius:"14px 14px 4px 14px", padding:"8px 12px",
    maxWidth:"78%", fontSize:"0.88rem", color:"#f1f5f9", lineHeight:"1.4", marginBottom:"1px",
  },
  timeStamp: { fontSize:"0.58rem", color:"#4b5563", marginTop:"2px", padding:"0 4px" },
  inputArea: {
    padding:"10px 14px", background:"#0f172a", borderTop:"1px solid #1f2937",
    display:"flex", gap:"8px", alignItems:"flex-end", flexShrink:0,
  },
  input: {
    flex:1, padding:"9px 14px", borderRadius:"22px", border:"1px solid #374151",
    background:"#1f2937", color:"white", fontSize:"0.88rem", outline:"none",
    fontFamily:"inherit", resize:"none", maxHeight:"80px", lineHeight:"1.4",
  },
  sendBtn: {
    width:"38px", height:"38px", borderRadius:"50%", border:"none",
    background:"linear-gradient(135deg, #2563eb, #3b82f6)", color:"white",
    cursor:"pointer", fontSize:"0.9rem", flexShrink:0,
  },
  blockedScreen: {
    padding:"14px", background:"#1a0808", borderTop:"1px solid #c0392b55",
    textAlign:"center", flexShrink:0,
  },
  unblockBtn: {
    marginTop:"8px", padding:"10px", width:"100%", border:"none", borderRadius:"10px",
    background:"linear-gradient(135deg, #c0392b, #e74c3c)", color:"white",
    fontWeight:700, cursor:"pointer", fontSize:"0.85rem",
  },
  chip: {
    alignSelf:"center", background:"#1f2937", borderRadius:"12px",
    padding:"3px 10px", fontSize:"0.62rem", color:"#6b7280", margin:"6px 0",
  },
  typingRow: {
    display:"flex", gap:"4px", alignItems:"center",
    padding:"8px 12px", background:"#1e3a5f",
    borderRadius:"14px 14px 14px 4px", alignSelf:"flex-start", marginBottom:"2px",
  },
  backBtn: {
    padding:"8px 16px", border:"1px solid #374151", borderRadius:"8px",
    background:"transparent", color:"#6b7280", cursor:"pointer",
    fontSize:"0.75rem", fontWeight:600, flexShrink:0,
  },
};

function getAngerColor(v) {
  if (v>=80) return "#ef4444";
  if (v>=50) return "#f97316";
  if (v>=25) return "#eab308";
  return "#22c55e";
}

function getStatusText(anger, blocked, typing) {
  if (blocked) return "🔴 Blocked you";
  if (typing)  return "typing...";
  if (anger>=80) return "😡 CHAMPA PAGULTHADI";
  if (anger>=60) return "😤 Very Angry";
  if (anger>=40) return "😒 Annoyed";
  if (anger>=20) return "😐 Okay mood";
  return "😊 Good mood";
}

function getTime() {
  return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true});
}

export default function ChatWithPandu({ onBack }) {
  const [msgs, setMsgs]           = useState([{ from:"kiran", text:"Ha chepu 😏", time:getTime() }]);
  const [input, setInput]         = useState("");
  const [anger, setAnger]         = useState(10);
  const [blocked, setBlocked]     = useState(false);
  const [typing, setTyping]       = useState(false);
  const [sorryCount, setSorryCount] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);

  const send = () => {
    if (!input.trim() || blocked) return;
    const text = input.trim();
    setInput("");

    const newAnger    = detectAnger(text);
    const updatedAnger = Math.min(100, anger * 0.65 + newAnger);
    setAnger(updatedAnger);

    setMsgs(prev => [...prev, { from:"user", text, time:getTime() }]);
    setTyping(true);

    const shouldBlock = newAnger >= 75 && Math.random() > 0.45;

    setTimeout(() => {
      setTyping(false);

      if (shouldBlock) {
        const blockReplies = rand(SPECIAL_REPLIES.blocking);
        const replies = Array.isArray(blockReplies) ? blockReplies : [blockReplies];
        replies.forEach((r, i) => setTimeout(() => {
          setMsgs(prev => [...prev, { from:"kiran", text:r, time:getTime() }]);
        }, i * 500));
        setTimeout(() => setBlocked(true), replies.length * 500 + 200);
        return;
      }

      const replies  = getSmartReply(text, updatedAnger);
      const replyArr = Array.isArray(replies) ? replies : [replies];
      replyArr.forEach((r, i) => setTimeout(() => {
        setMsgs(prev => [...prev, { from:"kiran", text:r, time:getTime() }]);
      }, i * 700));

      setTimeout(() => setAnger(a => Math.max(0, a - 5)), 1000);
    }, 800 + Math.random() * 800);
  };

  const sendSorry = () => {
    const newCount = sorryCount + 100;
    setSorryCount(newCount);
    setMsgs(prev => [...prev,
      { from:"user", text:`Sorry sorry sorry sorry sorry... (${newCount}/500) 🙏`, time:getTime() }
    ]);
    if (newCount >= 500) {
      setTimeout(() => {
        setBlocked(false); setAnger(50); setSorryCount(0);
        setMsgs(prev => [...prev, { from:"kiran", text:"...", time:getTime() }]);
        setTimeout(() => {
          setMsgs(prev => [...prev,
            { from:"kiran", text:"Sare fine 😒", time:getTime() },
            { from:"kiran", text:"Inkaite repeat cheyyaku", time:getTime() },
          ]);
        }, 1200);
      }, 1000);
    } else {
      setTimeout(() => {
        setMsgs(prev => [...prev,
          { from:"kiran", text:`${newCount}/500 sorries ayyai 😏 Inka ${500-newCount} cheppu`, time:getTime() }
        ]);
      }, 800);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.phone}>

        {/* Header */}
        <div style={styles.header}>
          {onBack && <button style={styles.backBtn} onClick={onBack}>←</button>}
          <div style={styles.avatar}>👑</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800, fontSize:"0.95rem"}}>Buddankay 😏</div>
            <div style={{fontSize:"0.68rem", color:"#6b7280", marginTop:"1px"}}>
              {getStatusText(anger, blocked, typing)}
            </div>
          </div>
          <div style={{fontSize:"0.7rem", color:getAngerColor(anger), fontWeight:700, textAlign:"right"}}>
            Kopam: {Math.round(anger)}%
          </div>
        </div>

        {/* Anger meter */}
        <div style={styles.angerBar}>
          <div style={{fontSize:"0.62rem", color:"#6b7280", whiteSpace:"nowrap"}}>😊</div>
          <div style={{flex:1, height:"5px", background:"#1f2937", borderRadius:"3px", overflow:"hidden"}}>
            <div style={{height:"100%", width:`${anger}%`, background:getAngerColor(anger), borderRadius:"3px", transition:"all 0.5s"}} />
          </div>
          <div style={{fontSize:"0.62rem", color:"#6b7280", whiteSpace:"nowrap"}}>😡</div>
        </div>

        {/* Chat */}
        <div style={styles.chatArea}>
          <div style={styles.chip}>Today · Chat with Pandu 😂</div>
          {msgs.map((msg, i) => (
            <div key={i} style={{display:"flex", flexDirection:"column", alignItems:msg.from==="kiran"?"flex-start":"flex-end"}}>
              <div style={msg.from==="kiran" ? styles.bubbleKiran : styles.bubbleUser}>{msg.text}</div>
              <div style={{...styles.timeStamp, alignSelf:msg.from==="kiran"?"flex-start":"flex-end"}}>
                {msg.time}{msg.from==="user"?" ✓✓":""}
              </div>
            </div>
          ))}
          {typing && (
            <div style={styles.typingRow}>
              {[0,1,2].map(i => (
                <div key={i} style={{width:"6px", height:"6px", borderRadius:"50%", background:"#3b82f6", animation:`pulse 1s ease-in-out ${i*0.2}s infinite`}} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Blocked / Input */}
        {blocked ? (
          <div style={styles.blockedScreen}>
            <div style={{color:"#ff8888", fontSize:"0.8rem"}}>
              📵 Kiran blocked you! 😂<br/>
              <span style={{color:"#6b7280", fontSize:"0.72rem"}}>{sorryCount}/500 sorries sent</span>
            </div>
            <button style={styles.unblockBtn} onClick={sendSorry}>
              Send 100 Sorries 🙏 ({sorryCount}/500)
            </button>
          </div>
        ) : (
          <div style={styles.inputArea}>
            <textarea
              style={styles.input}
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
            />
            <button style={styles.sendBtn} onClick={send}>➤</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:0.3; transform:scale(0.8); }
          50% { opacity:1; transform:scale(1.2); }
        }
      `}</style>
    </div>
  );
}
