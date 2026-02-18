'use client';

import { useState, useRef, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { getAllLessons, createLesson, updateLesson, deleteLesson, getStats } from '@/lib/firestore';
import { Lesson, LessonComponent, ComponentConfig, Stats } from '@/types';
import {
  BookOpen, LayoutDashboard, Settings, Plus, Trash2,
  ChevronRight, Eye, Save, Bold, Italic, Underline, List,
  ListOrdered, Heading1, Heading2, Heading3,
  Volume2, HelpCircle, CheckSquare, X,
  Globe, Users, TrendingUp, FileText, Mic, Video, Puzzle,
  BarChart2, Zap, Search, Menu, Bell, Edit3, ArrowLeft,
  Play, Pause, RotateCw, Check, RefreshCw, ChevronLeft, Star
} from "lucide-react";

// COMPONENT 1: Flashcard
function FlashcardComponent({ config }: { config: ComponentConfig }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = config.cards || [{ front: "صباح الخير", back: "Good morning" }, { front: "بسلامة", back: "Goodbye" }, { front: "شكرا", back: "Thank you" }];
  
  return (
    <div style={{padding:20,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <h4 style={{margin:0,fontSize:14,fontWeight:600,color:"#dce4f0"}}>Flashcards</h4>
        <span style={{fontSize:12,color:"#5a6880"}}>{currentIndex + 1} / {cards.length}</span>
      </div>
      <div onClick={() => setFlipped(!flipped)} style={{height:240,background:flipped?"#1a2535":"#0f1117",border:"2px solid #2a2d3a",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .3s"}}>
        <div style={{fontSize:flipped?18:28,fontWeight:flipped?500:700,color:"#dce4f0",textAlign:"center",padding:20,fontFamily:flipped?"'DM Sans'":"'Amiri', serif"}}>
          {flipped ? cards[currentIndex].back : cards[currentIndex].front}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:16}}>
        <button onClick={()=>{setFlipped(false);setCurrentIndex((currentIndex - 1 + cards.length) % cards.length);}} style={{flex:1,padding:"10px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:10,color:"#8b9cb8",cursor:"pointer",fontWeight:600}}>
          <ChevronLeft size={14} style={{display:"inline",marginRight:4}}/>Previous
        </button>
        <button onClick={() => setFlipped(!flipped)} style={{padding:"10px 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,color:"white",cursor:"pointer",fontWeight:600}}>
          <RotateCw size={14} style={{display:"inline",marginRight:6}}/>Flip
        </button>
        <button onClick={()=>{setFlipped(false);setCurrentIndex((currentIndex + 1) % cards.length);}} style={{flex:1,padding:"10px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:10,color:"#8b9cb8",cursor:"pointer",fontWeight:600}}>
          Next<ChevronRight size={14} style={{display:"inline",marginLeft:4}}/>
        </button>
      </div>
    </div>
  );
}

// COMPONENT 2: Quiz
function QuizComponent({ config }: { config: ComponentConfig }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const questions = config.questions || [{ q: "What does 'شكرا' mean?", options: ["Hello", "Thank you", "Goodbye", "Please"], correct: 1 }];
  const question = questions[currentQ];
  const isCorrect = selectedAnswer === question.correct;

  if (isSubmitted && currentQ === questions.length - 1) {
    return (
      <div style={{padding:30,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130",textAlign:"center"}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#10b981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <Star size={28} style={{color:"white"}}/>
        </div>
        <h3 style={{margin:"0 0 8px",fontSize:20,fontWeight:700,color:"#f0f4ff"}}>Quiz Complete!</h3>
        <p style={{margin:"0 0 20px",fontSize:14,color:"#8b9cb8"}}>You scored <strong style={{color:"#6ee7b7"}}>{score}</strong> out of {questions.length}</p>
        <button onClick={() => { setCurrentQ(0); setScore(0); setSelectedAnswer(null); setIsSubmitted(false); }} style={{padding:"10px 24px",background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:10,color:"white",fontWeight:600,cursor:"pointer"}}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{padding:20,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <h4 style={{margin:0,fontSize:14,fontWeight:600,color:"#dce4f0"}}>Quiz</h4>
        <span style={{fontSize:12,color:"#5a6880"}}>Question {currentQ + 1} / {questions.length}</span>
      </div>
      <p style={{fontSize:16,fontWeight:600,color:"#dce4f0",marginBottom:20}}>{question.q}</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {question.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const showCorrect = isSubmitted && i === question.correct;
          const showWrong = isSubmitted && isSelected && !isCorrect;
          return (
            <button key={i} onClick={() => !isSubmitted && setSelectedAnswer(i)} disabled={isSubmitted} style={{padding:"12px 16px",background: showCorrect ? "#064e3b" : showWrong ? "#450a0a" : isSelected ? "#1a2535" : "#0f1117",border: `2px solid ${showCorrect ? "#10b981" : showWrong ? "#ef4444" : isSelected ? "#6366f1" : "#2a2d3a"}`,borderRadius:10,color: showCorrect ? "#6ee7b7" : showWrong ? "#fca5a5" : "#dce4f0",cursor: isSubmitted ? "default" : "pointer",textAlign:"left",fontWeight:500,display:"flex",justifyContent:"space-between"}}>
              <span>{opt}</span>
              {showCorrect && <Check size={16}/>}
              {showWrong && <X size={16}/>}
            </button>
          );
        })}
      </div>
      {!isSubmitted ? (
        <button onClick={() => { setIsSubmitted(true); if (isCorrect) setScore(score + 1); }} disabled={selectedAnswer === null} style={{width:"100%",padding:"10px",background:selectedAnswer !== null ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#1e2130",border:"none",borderRadius:10,color:selectedAnswer !== null ? "white" : "#3a4050",fontWeight:600,cursor:selectedAnswer !== null ? "pointer" : "not-allowed"}}>
          Submit Answer
        </button>
      ) : (
        <div>
          <div style={{padding:12,background:isCorrect?"#064e3b":"#450a0a",border:`1px solid ${isCorrect?"#10b981":"#ef4444"}`,borderRadius:8,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            {isCorrect ? <Check size={16} style={{color:"#6ee7b7"}}/> : <X size={16} style={{color:"#fca5a5"}}/>}
            <span style={{fontSize:13,color:isCorrect?"#6ee7b7":"#fca5a5",fontWeight:600}}>
              {isCorrect ? "Correct!" : "Incorrect."}
            </span>
          </div>
          <button onClick={() => { setSelectedAnswer(null); setIsSubmitted(false); if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1); }} style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:10,color:"white",fontWeight:600,cursor:"pointer"}}>
            {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

// COMPONENT 3: Audio Player
function AudioPlayerComponent({ config }: { config: ComponentConfig }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 45;
  const tracks = config.tracks || [{ title: "Greeting", darija: "صباح الخير، كيداير؟", english: "Good morning, how are you?" }];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) interval = setInterval(() => setCurrentTime(t => (t >= duration ? 0 : t + 1)), 1000);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div style={{padding:20,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130"}}>
      <h4 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>Audio Pronunciation</h4>
      {tracks.map((track, i) => (
        <div key={i} style={{padding:16,background:"#0f1117",borderRadius:10,marginBottom:12,border:"1px solid #2a2d3a"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <button onClick={() => setPlaying(!playing)} style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#ec4899,#f472b6)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              {playing ? <Pause size={18} style={{color:"white"}}/> : <Play size={18} style={{color:"white",marginLeft:2}}/>}
            </button>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:"#dce4f0",marginBottom:4}}>{track.title}</div>
              <div style={{height:3,background:"#1e2130",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(currentTime/duration)*100}%`,background:"linear-gradient(90deg,#ec4899,#f472b6)",transition:"width .3s"}}/>
              </div>
            </div>
          </div>
          <div style={{fontSize:16,color:"#dce4f0",fontWeight:600,fontFamily:"'Amiri', serif",marginBottom:4,direction:"rtl",textAlign:"right"}}>{track.darija}</div>
          <div style={{fontSize:13,color:"#8b9cb8",fontStyle:"italic"}}>{track.english}</div>
        </div>
      ))}
    </div>
  );
}

// COMPONENT 4: Matching Game
function MatchingGameComponent({ config }: { config: ComponentConfig }) {
  const pairs = config.pairs || [{ darija: "شكرا", english: "Thank you" }, { darija: "بسلامة", english: "Goodbye" }, { darija: "صباح الخير", english: "Good morning" }];
  const [left, setLeft] = useState(pairs.map((p, i) => ({ id: i, text: p.darija, matched: false })));
  const [right, setRight] = useState([...pairs].map((p, i) => ({ id: i, text: p.english, matched: false })).sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState({ left: null as number | null, right: null as number | null });
  const [score, setScore] = useState(0);

  const selectLeft = (id: number) => {
    if (left.find(l => l.id === id)?.matched) return;
    const newSelected = { ...selected, left: id };
    setSelected(newSelected);
    if (newSelected.right !== null) checkMatch(newSelected);
  };

  const selectRight = (id: number) => {
    if (right.find(r => r.id === id)?.matched) return;
    const newSelected = { ...selected, right: id };
    setSelected(newSelected);
    if (newSelected.left !== null) checkMatch(newSelected);
  };

  const checkMatch = (sel: { left: number | null; right: number | null }) => {
    if (sel.left === sel.right) {
      setLeft(left.map(l => l.id === sel.left ? { ...l, matched: true } : l));
      setRight(right.map(r => r.id === sel.right ? { ...r, matched: true } : r));
      setScore(score + 1);
    }
    setTimeout(() => setSelected({ left: null, right: null }), 600);
  };

  if (left.every(l => l.matched)) {
    return (
      <div style={{padding:30,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>🎉</div>
        <h3 style={{margin:"0 0 8px",fontSize:18,fontWeight:700,color:"#f0f4ff"}}>Perfect Match!</h3>
        <button onClick={() => { setLeft(pairs.map((p, i) => ({ id: i, text: p.darija, matched: false }))); setRight([...pairs].map((p, i) => ({ id: i, text: p.english, matched: false })).sort(() => Math.random() - 0.5)); setSelected({ left: null, right: null }); setScore(0); }} style={{marginTop:20,padding:"10px 24px",background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:10,color:"white",fontWeight:600,cursor:"pointer"}}>
          <RefreshCw size={14} style={{display:"inline",marginRight:6}}/>Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={{padding:20,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <h4 style={{margin:0,fontSize:14,fontWeight:600,color:"#dce4f0"}}>Matching Game</h4>
        <span style={{fontSize:12,color:"#5a6880"}}>Matched: {score} / {pairs.length}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {left.map(item => (
            <button key={item.id} onClick={() => selectLeft(item.id)} disabled={item.matched} style={{padding:"12px 14px",background: item.matched ? "#064e3b" : selected.left === item.id ? "#1a2535" : "#0f1117",border: `2px solid ${item.matched ? "#10b981" : selected.left === item.id ? "#6366f1" : "#2a2d3a"}`,borderRadius:10,color: item.matched ? "#6ee7b7" : "#dce4f0",fontFamily:"'Amiri', serif",fontSize:16,fontWeight:600,cursor: item.matched ? "default" : "pointer",textAlign:"right",direction:"rtl"}}>
              {item.text}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {right.map(item => (
            <button key={item.id} onClick={() => selectRight(item.id)} disabled={item.matched} style={{padding:"12px 14px",background: item.matched ? "#064e3b" : selected.right === item.id ? "#1a2535" : "#0f1117",border: `2px solid ${item.matched ? "#10b981" : selected.right === item.id ? "#6366f1" : "#2a2d3a"}`,borderRadius:10,color: item.matched ? "#6ee7b7" : "#dce4f0",fontSize:14,fontWeight:500,cursor: item.matched ? "default" : "pointer"}}>
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// COMPONENT 5-8: Placeholders for Video, Dialogue, Grammar, Reading
const VideoEmbedComponent = ({ config }: { config: ComponentConfig }) => <div style={{padding:20,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130"}}><h4 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>{config.title || "Video Lesson"}</h4><div style={{position:"relative",paddingBottom:"56.25%",height:0,overflow:"hidden",borderRadius:10,background:"#000"}}><iframe src={`https://www.youtube.com/embed/${config.videoUrl || "dQw4w9WgXcQ"}`} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div></div>;
const DialogueComponent = ({ config }: { config: ComponentConfig }) => <div style={{padding:20,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130"}}><h4 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>Dialogue Practice</h4></div>;
const GrammarTableComponent = ({ config }: { config: ComponentConfig }) => <div style={{padding:20,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130"}}><h4 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>Grammar Table</h4></div>;
const ReadingPassageComponent = ({ config }: { config: ComponentConfig }) => <div style={{padding:20,background:"#0a0c14",borderRadius:12,border:"1px solid #1e2130"}}><h4 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>Reading Passage</h4></div>;

const COMPONENT_TYPES = { flashcard: FlashcardComponent, quiz: QuizComponent, audio: AudioPlayerComponent, matching: MatchingGameComponent, video: VideoEmbedComponent, dialogue: DialogueComponent, grammar: GrammarTableComponent, reading: ReadingPassageComponent };

// Config Editors
function FlashcardEditor({ config, onChange }: { config: ComponentConfig; onChange: (config: ComponentConfig) => void }) {
  const cards = config.cards || [{ front: "", back: "" }];
  const updateCard = (i: number, field: 'front' | 'back', value: string) => { const newCards = [...cards]; newCards[i][field] = value; onChange({ ...config, cards: newCards }); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {cards.map((card, i) => (
        <div key={i} style={{padding:14,background:"#0a0c14",borderRadius:10,border:"1px solid #2a2d3a"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#5a6880",marginBottom:10}}>Card {i + 1}</div>
          <input value={card.front} onChange={e => updateCard(i, "front", e.target.value)} placeholder="Darija (front)..." style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13,marginBottom:8,fontFamily:"'Amiri', serif",direction:"rtl",textAlign:"right"}}/>
          <input value={card.back} onChange={e => updateCard(i, "back", e.target.value)} placeholder="English (back)..." style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13}}/>
        </div>
      ))}
      <button onClick={() => onChange({ ...config, cards: [...cards, { front: "", back: "" }] })} style={{padding:"8px",background:"transparent",border:"2px dashed #2a2d3a",borderRadius:8,color:"#6ee7b7",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add Card</button>
    </div>
  );
}

function QuizEditor({ config, onChange }: { config: ComponentConfig; onChange: (config: ComponentConfig) => void }) {
  const questions = config.questions || [{ q: "", options: ["", "", "", ""], correct: 0 }];
  const updateQuestion = (i: number, field: string, value: any) => { const newQuestions = [...questions]; (newQuestions[i] as any)[field] = value; onChange({ ...config, questions: newQuestions }); };
  const updateOption = (qIdx: number, optIdx: number, value: string) => { const newQuestions = [...questions]; newQuestions[qIdx].options[optIdx] = value; onChange({ ...config, questions: newQuestions }); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {questions.map((q, i) => (
        <div key={i} style={{padding:14,background:"#0a0c14",borderRadius:10,border:"1px solid #2a2d3a"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#5a6880",marginBottom:10}}>Question {i + 1}</div>
          <input value={q.q} onChange={e => updateQuestion(i, "q", e.target.value)} placeholder="Question..." style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13,marginBottom:8}}/>
          {q.options.map((opt, j) => (
            <div key={j} style={{display:"flex",gap:8,marginBottom:6}}>
              <input type="radio" checked={q.correct === j} onChange={() => updateQuestion(i, "correct", j)} style={{cursor:"pointer"}}/>
              <input value={opt} onChange={e => updateOption(i, j, e.target.value)} placeholder={`Option ${j + 1}`} style={{flex:1,padding:"6px 10px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:6,color:"#dce4f0",fontSize:12}}/>
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => onChange({ ...config, questions: [...questions, { q: "", options: ["", "", "", ""], correct: 0 }] })} style={{padding:"8px",background:"transparent",border:"2px dashed #2a2d3a",borderRadius:8,color:"#6ee7b7",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add Question</button>
    </div>
  );
}

const CONFIG_EDITORS = {
  flashcard: FlashcardEditor,
  quiz: QuizEditor,
  audio: ({ config, onChange }: { config: ComponentConfig; onChange: (config: ComponentConfig) => void }) => <input value={config.title || ""} onChange={e => onChange({ ...config, title: e.target.value })} placeholder="Audio title..." style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13}}/>,
  video: ({ config, onChange }: { config: ComponentConfig; onChange: (config: ComponentConfig) => void }) => <div><input value={config.videoUrl || ""} onChange={e => onChange({ ...config, videoUrl: e.target.value })} placeholder="YouTube Video ID" style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13,marginBottom:8}}/><input value={config.title || ""} onChange={e => onChange({ ...config, title: e.target.value })} placeholder="Title" style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13}}/></div>,
  matching: ({ config, onChange }: { config: ComponentConfig; onChange: (config: ComponentConfig) => void }) => <input value={config.title || ""} onChange={e => onChange({ ...config, title: e.target.value })} placeholder="Matching game title..." style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13}}/>,
  dialogue: ({ config, onChange }: { config: ComponentConfig; onChange: (config: ComponentConfig) => void }) => <input value={config.title || ""} onChange={e => onChange({ ...config, title: e.target.value })} placeholder="Dialogue title..." style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13}}/>,
  grammar: ({ config, onChange }: { config: ComponentConfig; onChange: (config: ComponentConfig) => void }) => <input value={config.title || ""} onChange={e => onChange({ ...config, title: e.target.value })} placeholder="Grammar table title..." style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13}}/>,
  reading: ({ config, onChange }: { config: ComponentConfig; onChange: (config: ComponentConfig) => void }) => <input value={config.title || ""} onChange={e => onChange({ ...config, title: e.target.value })} placeholder="Reading passage title..." style={{width:"100%",padding:"8px 12px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13}}/>,
};

// Rich Text Editor
function RichEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const exec = (cmd: string, val: string | null = null) => { document.execCommand(cmd, false, val || undefined); editorRef.current?.focus(); if (onChange) onChange(editorRef.current?.innerHTML || ""); };
  const tools = [{ icon: <Heading1 size={15}/>, cmd: "formatBlock", val: "h1" }, { icon: <Heading2 size={15}/>, cmd: "formatBlock", val: "h2" }, null, { icon: <Bold size={15}/>, cmd: "bold" }, { icon: <Italic size={15}/>, cmd: "italic" }, null, { icon: <List size={15}/>, cmd: "insertUnorderedList" }, { icon: <ListOrdered size={15}/>, cmd: "insertOrderedList" }];
  return (
    <div style={{background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:10,overflow:"hidden"}}>
      <div style={{display:"flex",gap:2,padding:"8px 12px",borderBottom:"1px solid #2a2d3a",background:"#161820"}}>
        {tools.map((t, i) => t === null ? <div key={i} style={{width:1,height:20,background:"#2a2d3a",margin:"0 4px"}}/> : <button key={i} onMouseDown={e => { e.preventDefault(); exec(t.cmd, t.val || null); }} style={{padding:"5px 7px",background:"transparent",border:"none",cursor:"pointer",borderRadius:6,color:"#8b9cb8",display:"flex"}}>{t.icon}</button>)}
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={e => onChange && onChange(e.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: value }} style={{minHeight:200,padding:"20px 24px",color:"#dce4f0",fontSize:15,lineHeight:1.8,outline:"none",fontFamily:"'Georgia', serif"}}/>
    </div>
  );
}

// Lesson Editor
function LessonEditor({ lesson, onSave, onClose }: { lesson: Lesson | null; onSave: (data: Partial<Lesson>) => void; onClose: () => void }) {
  const [tab, setTab] = useState("content");
  const [title, setTitle] = useState(lesson?.title || "");
  const [level, setLevel] = useState(lesson?.level || "Beginner");
  const [status, setStatus] = useState(lesson?.status || "draft");
  const [body, setBody] = useState(lesson?.body || "<h2>Welcome</h2><p>Start adding content...</p>");
  const [components, setComponents] = useState<LessonComponent[]>(lesson?.components_list || []);
  const [editingComponent, setEditingComponent] = useState<LessonComponent | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const CATALOG = [
    { id: "flashcard" as const, icon: <Zap size={18}/>, label: "Flashcard Deck" },
    { id: "quiz" as const, icon: <HelpCircle size={18}/>, label: "Quiz Block" },
    { id: "audio" as const, icon: <Volume2 size={18}/>, label: "Audio Player" },
    { id: "matching" as const, icon: <Puzzle size={18}/>, label: "Matching Game" },
    { id: "video" as const, icon: <Video size={18}/>, label: "Video Embed" },
    { id: "dialogue" as const, icon: <Mic size={18}/>, label: "Dialogue" },
    { id: "grammar" as const, icon: <CheckSquare size={18}/>, label: "Grammar Table" },
    { id: "reading" as const, icon: <FileText size={18}/>, label: "Reading Passage" },
  ];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(5,7,14,.9)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflow:"auto"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');`}</style>
      <div style={{width:"100%",maxWidth:previewMode?1200:900,maxHeight:"92vh",background:"#0c0e16",borderRadius:16,border:"1px solid #2a2d3a",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",padding:"16px 24px",borderBottom:"1px solid #1e2130",background:"#0f1117",gap:12}}>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#5a6880",cursor:"pointer",display:"flex",padding:6,borderRadius:8}}><ArrowLeft size={18}/></button>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Lesson title…" style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#f0f4ff",fontSize:18,fontWeight:700}}/>
          <button onClick={() => setPreviewMode(!previewMode)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",background:previewMode?"#1a2535":"transparent",border:"1px solid #2a2d3a",borderRadius:8,color:"#7dd3fc",fontSize:12,fontWeight:600,cursor:"pointer"}}><Eye size={14}/>{previewMode?"Edit":"Preview"}</button>
          <select value={status} onChange={e=>setStatus(e.target.value as 'draft' | 'published')} style={{background:"#161820",border:"1px solid #2a2d3a",borderRadius:8,color:status==="published"?"#6ee7b7":"#fbbf24",fontSize:12,padding:"5px 10px",cursor:"pointer"}}><option value="draft">Draft</option><option value="published">Published</option></select>
          <button onClick={() => onSave({title,level,status,body,components_list:components})} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 18px",background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:8,color:"white",fontWeight:600,fontSize:13,cursor:"pointer"}}><Save size={14}/>Save</button>
        </div>

        {previewMode ? (
          <div style={{flex:1,overflow:"auto",padding:40,background:"#070910"}}>
            <div style={{maxWidth:800,margin:"0 auto"}}>
              <h1 style={{fontSize:32,fontWeight:700,color:"#f0f4ff",marginBottom:8}}>{title || "Untitled Lesson"}</h1>
              <div style={{fontSize:15,lineHeight:1.8,color:"#dce4f0",marginBottom:40}} dangerouslySetInnerHTML={{__html:body}}/>
              <div style={{display:"flex",flexDirection:"column",gap:24}}>
                {components.map(comp => { const Component = COMPONENT_TYPES[comp.type]; return Component ? <Component key={comp.id} config={comp.config}/> : null; })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{display:"flex",gap:0,borderBottom:"1px solid #1e2130",padding:"0 24px",background:"#0f1117"}}>
              {["content", "components"].map(t => <button key={t} onClick={() => setTab(t)} style={{padding:"10px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t?"#6ee7b7":"transparent"}`,color:tab===t?"#6ee7b7":"#5a6880",fontSize:13,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>)}
            </div>
            <div style={{flex:1,overflow:"auto",padding:24}}>
              {tab === "content" && (
                <div style={{display:"flex",flexDirection:"column",gap:20}}>
                  <div><label style={{display:"block",fontSize:11,fontWeight:600,color:"#5a6880",marginBottom:6}}>LEVEL</label><select value={level} onChange={e=>setLevel(e.target.value as any)} style={{width:"100%",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:8,color:"#dce4f0",fontSize:13,padding:"8px 12px",cursor:"pointer"}}>{["Beginner","Elementary","Intermediate","Advanced"].map(l=><option key={l}>{l}</option>)}</select></div>
                  <div><label style={{display:"block",fontSize:11,fontWeight:600,color:"#5a6880",marginBottom:8}}>LESSON CONTENT</label><RichEditor value={body} onChange={setBody}/></div>
                </div>
              )}
              {tab === "components" && (
                <div>
                  {!editingComponent ? (
                    <>
                      {components.length > 0 && (
                        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                          {components.map((c, i) => {
                            const catalogItem = CATALOG.find(cat => cat.id === c.type);
                            return (
                              <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:10}}>
                                <span style={{color:"#6ee7b7"}}>{catalogItem?.icon}</span>
                                <div style={{flex:1,fontSize:13,fontWeight:600,color:"#dce4f0"}}>{c.label}</div>
                                <button onClick={() => setEditingComponent(c)} style={{padding:"4px 10px",background:"#1a2535",border:"none",borderRadius:6,color:"#7dd3fc",cursor:"pointer",fontSize:11,fontWeight:600}}><Edit3 size={11} style={{display:"inline",marginRight:4}}/>Edit</button>
                                <button onClick={() => setComponents(components.filter(x => x.id !== c.id))} style={{padding:4,background:"transparent",border:"1px solid #2a2d3a",borderRadius:6,color:"#4a5c70",cursor:"pointer",display:"flex"}}><Trash2 size={14}/></button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div>
                        <p style={{margin:"0 0 12px",fontSize:12,fontWeight:600,color:"#5a6880",textTransform:"uppercase"}}>Add Component</p>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                          {CATALOG.map(c => <button key={c.id} onClick={() => setComponents([...components, { id: Date.now(), type: c.id, config: {}, label: c.label }])} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"#0f1117",border:"1px solid #2a2d3a",borderRadius:10,cursor:"pointer",textAlign:"left"}}><span style={{color:"#6ee7b7"}}>{c.icon}</span><span style={{fontSize:13,fontWeight:600,color:"#dce4f0"}}>{c.label}</span></button>)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                        <button onClick={() => setEditingComponent(null)} style={{background:"transparent",border:"none",color:"#5a6880",cursor:"pointer",display:"flex",padding:6}}><ArrowLeft size={18}/></button>
                        <h3 style={{margin:0,fontSize:15,fontWeight:700,color:"#dce4f0"}}>Edit {editingComponent.label}</h3>
                      </div>
                      {CONFIG_EDITORS[editingComponent.type] && CONFIG_EDITORS[editingComponent.type]({ config: editingComponent.config, onChange: (newConfig) => setComponents(components.map(c => c.id === editingComponent.id ? { ...c, config: newConfig } : c)) })}
                      <button onClick={() => setEditingComponent(null)} style={{marginTop:20,padding:"10px 24px",background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:10,color:"white",fontWeight:600,fontSize:13,cursor:"pointer"}}>Done</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Main App
export default function AdminPanel() {
  const { user, userProfile, loading } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<{msg: string; type: 'success' | 'error'} | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [lessonsData, statsData] = await Promise.all([
          getAllLessons(),
          getStats()
        ]);
        
        // Transform lessons to include new fields
        const transformedLessons = lessonsData.map(lesson => ({
          ...lesson,
          level: lesson.level || 'Beginner',
          status: lesson.status || 'draft',
          views: lesson.views || Math.floor(Math.random() * 1000),
          components: lesson.components_list?.length || 0,
          body: lesson.body || lesson.description,
          components_list: lesson.components_list || []
        }));
        
        setLessons(transformedLessons);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading data:', error);
        notify('Error loading data', 'error');
      } finally {
        setDataLoading(false);
      }
    };

    if (user && userProfile?.isAdmin) {
      loadData();
    }
  }, [user, userProfile]);

  const notify = (msg: string, type: 'success' | 'error' = "success") => { 
    setNotification({msg, type}); 
    setTimeout(() => setNotification(null), 3000); 
  };

  const saveLesson = async (data: Partial<Lesson>) => {
    if (!user || !userProfile) return;
    
    try {
      if (editingLesson) {
        await updateLesson(editingLesson.id, data, user.uid, user.displayName || user.email || 'Admin');
        setLessons(prev => prev.map(l => l.id === editingLesson.id ? {...l,...data,components:data.components_list?.length||0} : l));
        notify("Lesson updated!");
      } else {
        const lessonData = {
          title: data.title || 'Untitled Lesson',
          description: data.body || '',
          content: { vocabulary: [], sentences: [], exercises: [] },
          difficulty: 'beginner' as const,
          duration: 30,
          tags: [],
          topic: 'General',
          ...data
        };
        const id = await createLesson(lessonData, user.uid, user.displayName || user.email || 'Admin');
        setLessons(prev => [...prev, {...lessonData, id, views:0, components: data.components_list?.length || 0} as Lesson]);
        notify("Lesson created!");
      }
      setEditingLesson(null); 
      setCreatingLesson(false);
    } catch (error) {
      console.error('Error saving lesson:', error);
      notify('Error saving lesson', 'error');
    }
  };

  const deleteSelectedLesson = async (lesson: Lesson) => {
    if (!user || !userProfile) return;
    
    try {
      await deleteLesson(lesson.id, lesson.title, user.uid, user.displayName || user.email || 'Admin');
      setLessons(prev => prev.filter(l => l.id !== lesson.id));
      notify("Lesson deleted", "error");
    } catch (error) {
      console.error('Error deleting lesson:', error);
      notify('Error deleting lesson', 'error');
    }
  };

  const filteredLessons = lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));
  
  const dashboardStats = [
    { label: "Total Lessons", value: lessons.length, icon: <BookOpen size={18}/>, color: "#6ee7b7" },
    { label: "Students", value: stats?.totalUsers || 0, icon: <Users size={18}/>, color: "#7dd3fc" },
    { label: "Completion", value: "72%", icon: <TrendingUp size={18}/>, color: "#c4b5fd" },
    { label: "Published", value: lessons.filter(l=>l.status==="published").length, icon: <Globe size={18}/>, color: "#fbbf24" },
  ];
  
  const navItems = [
    { id: "dashboard", icon: <LayoutDashboard size={17}/>, label: "Dashboard" }, 
    { id: "lessons", icon: <BookOpen size={17}/>, label: "Lessons" }, 
    { id: "analytics", icon: <BarChart2 size={17}/>, label: "Analytics" }, 
    { id: "settings", icon: <Settings size={17}/>, label: "Settings" }
  ];

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !userProfile?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{display:"flex",height:"100vh",background:"#070910",fontFamily:"'DM Sans', system-ui, sans-serif",color:"#dce4f0",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0c0e16}::-webkit-scrollbar-thumb{background:#2a2d3a}*{box-sizing:border-box}`}</style>
      {notification && <div style={{position:"fixed",top:20,right:20,zIndex:2000,padding:"10px 18px",borderRadius:10,background:notification.type==="success"?"#064e3b":"#450a0a",border:`1px solid ${notification.type==="success"?"#10b981":"#ef4444"}`,color:notification.type==="success"?"#6ee7b7":"#fca5a5",fontSize:13,fontWeight:600}}>{notification.type==="success"?"✓":"⚠"} {notification.msg}</div>}
      
      <aside style={{width: sidebarOpen ? 220 : 64, background:"#0a0c14", borderRight:"1px solid #1e2130", display:"flex", flexDirection:"column", transition:"width .25s", flexShrink:0}}>
        <div style={{padding:sidebarOpen?"20px 20px 16px":"20px 0 16px",display:"flex",alignItems:"center",gap:10,justifyContent:sidebarOpen?"flex-start":"center",borderBottom:"1px solid #1e2130"}}>
          <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#10b981,#0891b2)",display:"flex",alignItems:"center",justifyContent:"center"}}><Globe size={17} style={{color:"white"}}/></div>
          {sidebarOpen && <div><div style={{fontSize:14,fontWeight:700,color:"#f0f4ff"}}>DarijaAdmin</div><div style={{fontSize:10,color:"#3a5060"}}>Moroccan Darija</div></div>}
        </div>
        <nav style={{flex:1,padding:"12px 10px",display:"flex",flexDirection:"column",gap:2}}>
          {navItems.map(item => <button key={item.id} onClick={() => setPage(item.id)} style={{display:"flex",alignItems:"center",gap:10,padding:sidebarOpen?"9px 12px":"9px",justifyContent:sidebarOpen?"flex-start":"center",background:page===item.id?"linear-gradient(135deg,rgba(16,185,129,.12),rgba(8,145,178,.08))":"transparent",border:`1px solid ${page===item.id?"rgba(16,185,129,.25)":"transparent"}`,borderRadius:9,color:page===item.id?"#6ee7b7":"#5a6880",cursor:"pointer",fontSize:13,fontWeight:page===item.id?600:500}}><span>{item.icon}</span>{sidebarOpen && <span>{item.label}</span>}</button>)}
        </nav>
        <button onClick={() => setSidebarOpen(p=>!p)} style={{margin:"10px 10px 14px",padding:"8px",background:"transparent",border:"1px solid #1e2130",borderRadius:8,cursor:"pointer",color:"#3a4050",display:"flex",alignItems:"center",justifyContent:"center"}}><Menu size={16}/></button>
      </aside>

      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{display:"flex",alignItems:"center",padding:"0 28px",height:60,borderBottom:"1px solid #1e2130",background:"#0a0c14",gap:12}}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:10,background:"#0f1117",border:"1px solid #1e2130",borderRadius:10,padding:"7px 14px",maxWidth:340}}><Search size={15} style={{color:"#3a4050"}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search lessons…" style={{background:"transparent",border:"none",outline:"none",color:"#dce4f0",fontSize:13,width:"100%"}}/></div>
          <div style={{marginLeft:"auto",display:"flex",gap:10}}><button style={{width:36,height:36,borderRadius:9,background:"#0f1117",border:"1px solid #1e2130",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#5a6880"}}><Bell size={16}/></button><div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#6ee7b7,#7dd3fc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#0a0c14"}}>{(user.displayName || user.email || 'A')[0].toUpperCase()}</div></div>
        </header>

        <div style={{flex:1,overflow:"auto",padding:28}}>
          {page === "dashboard" && (
            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div><h1 style={{margin:0,fontSize:24,fontWeight:700,color:"#f0f4ff"}}>مرحبا! Welcome 👋</h1><p style={{margin:"4px 0 0",color:"#5a6880",fontSize:14}}>Moroccan Darija learning platform</p></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
                {dashboardStats.map(s=><div key={s.label} style={{background:"#0c0e16",border:"1px solid #1e2130",borderRadius:14,padding:"18px 20px"}}><span style={{padding:8,borderRadius:8,background:`${s.color}15`,color:s.color,display:"inline-flex",marginBottom:14}}>{s.icon}</span><div style={{fontSize:26,fontWeight:700,color:"#f0f4ff"}}>{s.value}</div><div style={{fontSize:12,color:"#5a6880",marginTop:4}}>{s.label}</div></div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
                <div style={{background:"#0c0e16",border:"1px solid #1e2130",borderRadius:14,padding:20}}><h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>Recent Lessons</h3><div style={{display:"flex",flexDirection:"column",gap:10}}>{lessons.slice(0,4).map(l=><div key={l.id} onClick={()=>{setEditingLesson(l);setCreatingLesson(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"#0f1117",borderRadius:9,cursor:"pointer"}}><div style={{width:8,height:8,borderRadius:"50%",background:l.status==="published"?"#6ee7b7":"#fbbf24"}}/><div style={{flex:1,fontSize:13,color:"#dce4f0",fontWeight:500}}>{l.title}</div><ChevronRight size={13} style={{color:"#2a3040"}}/></div>)}</div></div>
                <div style={{background:"#0c0e16",border:"1px solid #1e2130",borderRadius:14,padding:20}}><h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>Quick Actions</h3><button onClick={()=>{setCreatingLesson(true);setEditingLesson(null);}} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:10,color:"white",fontWeight:600,fontSize:13,cursor:"pointer",marginBottom:10}}><Plus size={16} style={{display:"inline",marginRight:6}}/>New Lesson</button></div>
              </div>
            </div>
          )}

          {page === "lessons" && (
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><h1 style={{margin:0,fontSize:22,fontWeight:700,color:"#f0f4ff"}}>Lessons</h1><p style={{margin:"4px 0 0",fontSize:13,color:"#5a6880"}}>{filteredLessons.length} total</p></div><button onClick={()=>{setCreatingLesson(true);setEditingLesson(null);}} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 20px",background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:13,cursor:"pointer"}}><Plus size={15}/>New Lesson</button></div>
              <div style={{background:"#0c0e16",border:"1px solid #1e2130",borderRadius:14,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 80px 80px 100px",padding:"10px 18px",borderBottom:"1px solid #1e2130",fontSize:11,fontWeight:600,color:"#3a4050",textTransform:"uppercase"}}><span>Title</span><span>Level</span><span>Status</span><span>Views</span><span>Comps</span><span>Actions</span></div>
                {filteredLessons.map(lesson => <div key={lesson.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 80px 80px 100px",padding:"13px 18px",borderBottom:"1px solid #0f1117",fontSize:13,alignItems:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#0f1117"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><span style={{fontWeight:600,color:"#dce4f0"}}>{lesson.title}</span><span style={{color:"#8b9cb8"}}>{lesson.level}</span><span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:lesson.status==="published"?"#064e3b":"#2d1b00",color:lesson.status==="published"?"#6ee7b7":"#fbbf24",width:"fit-content"}}>{lesson.status}</span><span style={{color:"#5a6880"}}>{lesson.views}</span><span style={{color:"#5a6880"}}>{lesson.components}</span><span style={{display:"flex",gap:6}}><button onClick={()=>{setEditingLesson(lesson);setCreatingLesson(false);}} style={{padding:"4px 8px",background:"#1a2535",border:"none",borderRadius:6,color:"#7dd3fc",cursor:"pointer",fontSize:11}}><Edit3 size={11}/>Edit</button><button onClick={()=>deleteSelectedLesson(lesson)} style={{padding:"4px 7px",background:"transparent",border:"1px solid #2a2d3a",borderRadius:6,color:"#4a5c70",cursor:"pointer"}}><Trash2 size={11}/></button></span></div>)}
              </div>
            </div>
          )}

          {page === "analytics" && <div><h1 style={{margin:"0 0 20px",fontSize:22,fontWeight:700,color:"#f0f4ff"}}>Analytics</h1><div style={{background:"#0c0e16",border:"1px solid #1e2130",borderRadius:14,padding:20}}><h3 style={{margin:"0 0 20px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>Coming Soon</h3><p style={{color:"#8b9cb8"}}>Analytics dashboard will be available soon.</p></div></div>}
          
          {page === "settings" && <div><h1 style={{margin:"0 0 20px",fontSize:22,fontWeight:700,color:"#f0f4ff"}}>Settings</h1><div style={{background:"#0c0e16",border:"1px solid #1e2130",borderRadius:14,padding:20}}><h3 style={{margin:"0 0 20px",fontSize:14,fontWeight:600,color:"#dce4f0"}}>Admin Settings</h3><p style={{color:"#8b9cb8"}}>Settings panel will be available soon.</p></div></div>}
        </div>
      </main>

      {(editingLesson || creatingLesson) && <LessonEditor lesson={editingLesson} onSave={saveLesson} onClose={() => { setEditingLesson(null); setCreatingLesson(false); }}/>}
    </div>
  );
}
