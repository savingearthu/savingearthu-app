import { useState, useEffect, useRef } from "react";

const API_URL      = "https://script.google.com/macros/s/AKfycbyzE7WdVzzrdS7PhzyvponsP9wvtSxI9EroRozP12vVeCLtC1RPe_Rx1bKOORnxkzEy/exec";
const LOGO_URL     = "https://cdn.imweb.me/upload/S20230420b05ab2cbf2d03/17b01aa6bd13a.png";
const INTERVIEW_URL= "https://savingearthu.org/actions/?q=YToyOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjtzOjQ6InBhZ2UiO2k6Mjt9&bmode=view&idx=170382834&t=board";
const RECYCLE_URL  = "https://savingearthu.org/actions/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=170908572&t=board";
const HOME_URL     = "https://savingearthu.org/";
const INSTA_URL    = "https://www.instagram.com/savingearthu/";
const MAP_URL      = "https://map.naver.com/p/favorite/myPlace/folder/11dff33693824487b7ff9cfcadea7c8c?c=15.00,0,0,0,dh";
const CONTACT_URL  = "https://savingearthu.org/send";
const BG_IMG       = "bg2.JPG";
const TEACHER_IMG  = "DSCF6872_2.jpg";
const RECYCLE_IMG  = "DSCF5384.JPG";
const GREEN = "#00a54f";
const BLUE  = "#00aeef";

function getCafeId() {
  return new URLSearchParams(window.location.search).get("cafeId") || "";
}

function fmt(n) {
  const v = Number(n);
  if (isNaN(v)) return "0";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toLocaleString("ko-KR");
}

function LoadingScreen() {
  return (
    <div style={{ background:"#f0f0f0", minHeight:"100vh", display:"flex", justifyContent:"center" }}>
    <div style={{ width:"100%", maxWidth:480, minHeight:"100vh", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
      <img src={LOGO_URL} alt="지소행" style={{ width:200 }}/>
      <p style={{ fontSize:16, color:"#ccc", fontWeight:400 }}>지구카페 찾는 중...</p>
    </div>
    </div>
  );
}

function ErrorScreen({ detail }) {
  return (
    <div style={{ background:"#f0f0f0", minHeight:"100vh", display:"flex", justifyContent:"center" }}>
    <div style={{ width:"100%", maxWidth:480, minHeight:"100vh", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"2rem", gap:8 }}>
      <p style={{ fontSize:16, color:"#aaa" }}>카페 정보를 찾을 수 없어요.</p>
      <p style={{ fontSize:14, color:"#ccc" }}>{detail}</p>
    </div>
    </div>
  );
}

function CountUp({ value, style }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    const duration = 800;
    const steps = 60;
    const increment = value / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span style={style}>{display.toLocaleString("ko-KR")}</span>;
}

function HomeScreen() {
  const [cafes, setCafes]     = useState([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(null);

  useEffect(() => {
    fetch(`${API_URL}?action=list`, { redirect:"follow" })
      .then(r => r.json())
      .then(d => { setCafes((d.cafes || []).sort((a, b) => a.name.localeCompare(b.name, "ko"))); setLoading(false); })
      .catch(() => setLoading(false));
    fetch(`${API_URL}?action=total`, { redirect:"follow" })
      .then(r => r.json())
      .then(d => setTotal(d))
      .catch(() => {});
  }, []);

  function select(cafe) {
    window.location.href = `?cafeId=${encodeURIComponent(cafe.id)}`;
  }

  return (
    <div style={{ background:"#f0f0f0", height:"100vh", display:"flex", justifyContent:"center", overflow:"hidden" }}>
    <div style={{ width:"100%", maxWidth:480, height:"100vh", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 2.5rem", gap:"1.8rem", position:"relative", overflow:"hidden" }}>

      {/* 전체 종이팩 카운터 + 스티커 */}
      {total && (
        <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
          <p style={{ fontSize:13, color:"#bbb", marginBottom:8, fontWeight:400 }}>
            충무로 지구카페가 함께 모은 종이팩
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <img src="/sticker5.png" alt="" style={{ width:64, objectFit:"contain" }}/>
            <div>
              <CountUp value={total.count} style={{ fontSize:64, fontWeight:900, color:GREEN, letterSpacing:-2, lineHeight:1 }}/>
              <span style={{ fontSize:20, color:"#aaa", fontWeight:500, marginLeft:4 }}>개</span>
            </div>
            <img src="/sticker6.png" alt="" style={{ width:64, objectFit:"contain" }}/>
          </div>
        </div>
      )}

      <div style={{ width:"100%", position:"relative", zIndex:100 }}>
        <button onClick={() => setOpen(o => !o)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:BLUE, borderRadius:50, padding:"15px 22px", border:"none", cursor:"pointer" }}>
          <span style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span className="material-symbols-outlined" style={{ fontSize:22, color:"#fff" }}>search</span>
            <span style={{ fontSize:17, color:"#fff", fontWeight:600 }}>지구 카페 찾기</span>
          </span>
          <span className="material-symbols-outlined" style={{ fontSize:22, color:"rgba(255,255,255,0.8)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .2s" }}>keyboard_arrow_down</span>
        </button>

        {open && (
          <>
            <div style={{ position:"fixed", inset:0, zIndex:99 }} onClick={() => setOpen(false)}/>
            <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, right:0, background:"#fff", borderRadius:16, boxShadow:"0 8px 32px rgba(0,0,0,0.1)", maxHeight:300, overflowY:"auto", border:"1.5px solid #e8e8e8", zIndex:100 }}>
              {loading ? (
                <p style={{ padding:"1rem", textAlign:"center", fontSize:15, color:"#ccc" }}>지구카페 찾는 중...</p>
              ) : cafes.map((cafe, i) => (
                <div key={cafe.id} onClick={() => select(cafe)}
                  style={{ padding:"15px 22px", cursor:"pointer", fontSize:16, color:"#222", borderBottom: i < cafes.length-1 ? "1px solid #f5f5f5" : "none", display:"flex", alignItems:"center", gap:10 }}
                  onMouseEnter={e => e.currentTarget.style.background="#f5f5f5"}
                  onMouseLeave={e => e.currentTarget.style.background="#fff"}
                >
                  <span style={{ width:7, height:7, borderRadius:"50%", background:BLUE, flexShrink:0, display:"inline-block" }}/>
                  {cafe.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p style={{ fontSize:15, color:"#bbb", textAlign:"center", lineHeight:2, fontWeight:400, position:"relative", zIndex:1 }}>
        지소행과 함께 종이팩 자원순환을 실천하는<br/>충무로의 지구카페들을 확인해보세요!
      </p>

      <div style={{ position:"absolute", bottom:24, display:"flex", flexDirection:"column", alignItems:"center", gap:10, zIndex:1 }}>
        <a href={HOME_URL} target="_blank" rel="noreferrer">
          <img src={LOGO_URL} alt="지소행" style={{ width:110, objectFit:"contain" }}/>
        </a>
        <div style={{ display:"flex", gap:20 }}>
          <a href={INSTA_URL} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#bbb", textDecoration:"none" }}>인스타그램</a>
          <a href={HOME_URL} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#bbb", textDecoration:"none" }}>홈페이지</a>
          <a href={CONTACT_URL} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#bbb", textDecoration:"none" }}>문의하기</a>
        </div>
      </div>
    </div>
    </div>
  );
}

function CafePage({ data }) {
  const handleRef  = useRef(null);
  const isDragging = useRef(false);
  const startY     = useRef(0);
  const startTop   = useRef(0);
  const PHOTO_H    = 240;
  const MIN_TOP    = 60;
  const INIT_TOP   = PHOTO_H - 20;
  const [sheetTop, setSheetTop] = useState(INIT_TOP);

  function onHandleTouchStart(e) {
    isDragging.current = true;
    startY.current     = e.touches[0].clientY;
    startTop.current   = sheetTop;
  }

  function onHandleTouchMove(e) {
    if (!isDragging.current) return;
    e.preventDefault();
    const dy   = e.touches[0].clientY - startY.current;
    const next = Math.min(INIT_TOP, Math.max(MIN_TOP, startTop.current + dy));
    setSheetTop(next);
  }

  function onHandleTouchEnd() {
    isDragging.current = false;
    const mid = (MIN_TOP + INIT_TOP) / 2;
    setSheetTop(sheetTop < mid ? MIN_TOP : INIT_TOP);
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: data.cafe, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("링크가 복사되었어요!");
    }
  }

  const STATS = [
    { icon:"package_2", label:"종이팩",    value:fmt(data.count),  unit:"개"  },
    { icon:"forest",    label:"살린 나무", value:fmt(data.trees),  unit:"그루" },
    { icon:"recycling", label:"재생 휴지", value:fmt(data.tissue), unit:"개"  },
  ];

  const FLOW_ROW1 = [
    { icon:"local_cafe",     label:"카페"        },
    { icon:"local_shipping", label:"지소행(수거)" },
    { icon:"factory",        label:"제지사"      },
  ];
  const FLOW_ROW2 = [
    { icon:"recycling",          label:"재생 휴지"      },
    { icon:"volunteer_activism", label:"기후취약계층 전달" },
  ];

  return (
    <div style={{ background:"#f0f0f0", minHeight:"100vh", display:"flex", justifyContent:"center" }}>
    <div style={{ width:"100%", maxWidth:480, height:"100vh", overflow:"hidden", position:"relative", background:"#fff" }}>

      <div style={{ position:"absolute", top:0, left:0, right:0, height:PHOTO_H, overflow:"hidden", background:"#e8e8e8" }}>
        <img src={BG_IMG} alt="배경" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center center", display:"block" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.25))" }}/>
        <a href="/" style={{ position:"absolute", top:16, left:16, background:"#fff", borderRadius:"50%", width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", textDecoration:"none" }}>
          <span className="material-symbols-outlined" style={{ fontSize:20, color:"#333" }}>arrow_back</span>
        </a>
      </div>

      <div style={{ position:"absolute", left:0, right:0, top:sheetTop, bottom:0, background:"#fff", borderRadius:"20px 20px 0 0", boxShadow:"0 -4px 24px rgba(0,0,0,0.1)", display:"flex", flexDirection:"column", transition:"top 0.3s ease" }}>
        <div
          ref={handleRef}
          onTouchStart={onHandleTouchStart}
          onTouchMove={onHandleTouchMove}
          onTouchEnd={onHandleTouchEnd}
          style={{ padding:"14px 0 14px", display:"flex", justifyContent:"center", cursor:"grab", flexShrink:0, touchAction:"none" }}
        >
          <div style={{ width:36, height:4, background:"#ddd", borderRadius:2 }}/>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"6px 20px 48px", WebkitOverflowScrolling:"touch" }}>

          <div style={{ textAlign:"center", marginBottom:10 }}>
            <img src="sublogo.png" alt="" style={{ width:64, opacity:1 }}/>
          </div>

          <div style={{ textAlign:"center", marginBottom:14 }}>
            <span style={{ display:"inline-block", background:"#e8f5ee", borderRadius:20, padding:"5px 16px", fontSize:13, color:GREEN, fontWeight:600 }}>
              2025년부터 함께하는 지구카페
            </span>
          </div>

          <h1 style={{ fontSize:30, fontWeight:800, color:"#0a1a2e", lineHeight:1.2, marginBottom:20, textAlign:"center" }}>
            {data.cafe}
          </h1>

          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            {STATS.map((s,i) => (
              <div key={i} style={{ flex:1, background:"#f0faf4", borderRadius:14, padding:"12px 4px", textAlign:"center" }}>
                <span className="material-symbols-outlined" style={{ fontSize:22, color:GREEN, display:"block", marginBottom:5 }}>{s.icon}</span>
                <p style={{ fontSize:18, fontWeight:800, color:GREEN, lineHeight:1 }}>
                  {s.value}<span style={{ fontSize:11, color:"#aaa", fontWeight:500, marginLeft:2 }}>{s.unit}</span>
                </p>
                <p style={{ fontSize:12, color:"#888", marginTop:4 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize:16, fontWeight:700, color:"#0a1a2e", marginBottom:4, textAlign:"center" }}>자원순환 구조</p>
          <p style={{ fontSize:12, color:"#bbb", textAlign:"center", marginBottom:12 }}>버려지는 종이팩이 따뜻한 마음이 되기까지</p>
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:2, marginBottom:6 }}>
              {FLOW_ROW1.map((f, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
                  <div style={{ flex:1, background:"#f0f9ff", borderRadius:10, padding:"12px 2px", textAlign:"center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize:22, color:BLUE, display:"block", marginBottom:5 }}>{f.icon}</span>
                    <p style={{ fontSize:11, color:"#0a6a8a", wordBreak:"keep-all", lineHeight:1.3 }}>{f.label}</p>
                  </div>
                  {i < FLOW_ROW1.length-1 && (
                    <span style={{ fontSize:18, color:BLUE, fontWeight:800, flexShrink:0, margin:"0 3px" }}>›</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:2, justifyContent:"center" }}>
              <div style={{ width:"38%", background:"#f0f9ff", borderRadius:10, padding:"12px 2px", textAlign:"center" }}>
                <span className="material-symbols-outlined" style={{ fontSize:22, color:BLUE, display:"block", marginBottom:5 }}>{FLOW_ROW2[0].icon}</span>
                <p style={{ fontSize:11, color:"#0a6a8a" }}>{FLOW_ROW2[0].label}</p>
              </div>
              <span style={{ fontSize:18, color:BLUE, fontWeight:800, flexShrink:0, margin:"0 3px" }}>›</span>
              <div style={{ width:"38%", background:"#e8f5ee", borderRadius:10, padding:"12px 2px", textAlign:"center" }}>
                <span className="material-symbols-outlined" style={{ fontSize:22, color:GREEN, display:"block", marginBottom:5 }}>{FLOW_ROW2[1].icon}</span>
                <a href="https://savingearthu.org/actions/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=170470777&t=board"
                  target="_blank" rel="noreferrer"
                  style={{ fontSize:10, color:GREEN, wordBreak:"keep-all", lineHeight:1.3, fontWeight:600, textDecoration:"underline", textUnderlineOffset:2 }}>
                  {FLOW_ROW2[1].label} →
                </a>
              </div>
            </div>
          </div>

          <p style={{ fontSize:16, fontWeight:700, color:"#0a1a2e", marginBottom:12, textAlign:"center" }}>함께하는 사람들</p>
          <div style={{ display:"flex", borderRadius:14, overflow:"hidden", border:"1px solid #eef2f8", marginBottom:24 }}>
            <div style={{ flex:1, background:"#f7fafe" }}>
              <img src={TEACHER_IMG} alt="황무연 선생님" style={{ width:"100%", height:120, objectFit:"cover", objectPosition:"center top", display:"block" }}/>
              <div style={{ padding:"14px 12px 16px", textAlign:"center" }}>
                <p style={{ fontSize:14, fontWeight:700, color:"#0a1a2e", marginBottom:6 }}>황무연 선생님</p>
                <p style={{ fontSize:12, color:"#888", lineHeight:1.8, marginBottom:8 }}>충무로 카페 종이팩을<br/>매일 수거하시는<br/>어르신 활동가</p>
                <a href={INTERVIEW_URL} target="_blank" rel="noreferrer" style={{ fontSize:12, fontWeight:700, color:BLUE, textDecoration:"none" }}>이야기 들으러가기 →</a>
              </div>
            </div>
            <div style={{ width:1, background:"#e8eef8", flexShrink:0 }}/>
            <div style={{ flex:1, background:"#f7fafe" }}>
              <img src={RECYCLE_IMG} alt="종이팩 다시쓰기" style={{ width:"100%", height:120, objectFit:"cover", objectPosition:"center", display:"block" }}/>
              <div style={{ padding:"14px 12px 16px", textAlign:"center" }}>
                <p style={{ fontSize:14, fontWeight:700, color:"#0a1a2e", marginBottom:6 }}>종이팩 다시쓰기</p>
                <p style={{ fontSize:12, color:"#888", lineHeight:1.8, marginBottom:8 }}>직접 충무로 카페 종이팩을<br/>수거하고 자원순환 과정을<br/>배우는 기업 ESG 봉사 프로그램</p>
                <a href={RECYCLE_URL} target="_blank" rel="noreferrer" style={{ fontSize:12, fontWeight:700, color:BLUE, textDecoration:"none" }}>활동 보러가기 →</a>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
            <a href={MAP_URL} target="_blank" rel="noreferrer" style={{ display:"block", width:"100%", padding:"15px", background:BLUE, borderRadius:50, textAlign:"center", fontSize:15, fontWeight:700, color:"#fff", textDecoration:"none" }}>
              다른 지구 카페 확인하기 →
            </a>
            <button onClick={share} style={{ width:"100%", padding:"15px", background:GREEN, borderRadius:50, border:"none", cursor:"pointer", fontSize:15, fontWeight:700, color:"#fff" }}>
              공유하기
            </button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <a href={HOME_URL} target="_blank" rel="noreferrer">
              <img src={LOGO_URL} alt="지소행" style={{ width:110, objectFit:"contain" }}/>
            </a>
            <div style={{ display:"flex", gap:20 }}>
              <a href={INSTA_URL} target="_blank" rel="noreferrer" style={{ fontSize:14, color:"#bbb", textDecoration:"none" }}>인스타그램</a>
              <a href={HOME_URL} target="_blank" rel="noreferrer" style={{ fontSize:14, color:"#bbb", textDecoration:"none" }}>홈페이지</a>
              <a href={CONTACT_URL} target="_blank" rel="noreferrer" style={{ fontSize:14, color:"#bbb", textDecoration:"none" }}>문의하기</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function App() {
  const cafeId = getCafeId();
  if (!cafeId) return <HomeScreen />;
  return <CafeDetailLoader cafeId={cafeId} />;
}

function CafeDetailLoader({ cafeId }) {
  const [status, setStatus] = useState("loading");
  const [data, setData]     = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    fetch(`${API_URL}?cafeId=${encodeURIComponent(cafeId)}`, { redirect:"follow" })
      .then(r => r.json())
      .then(d => {
        if (!d.cafe) { setErrMsg(`등록된 카페를 찾지 못했어요. (${cafeId})`); setStatus("error"); }
        else { setData(d); setStatus("ok"); }
      })
      .catch(e => { setErrMsg(e.message); setStatus("error"); });
  }, [cafeId]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error")   return <ErrorScreen detail={errMsg} />;
  return <CafePage data={data} />;
}