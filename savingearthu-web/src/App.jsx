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

function HomeScreen() {
  const [cafes, setCafes]     = useState([]);
  const [open, setOpen]       = useState(false);
  const [closing, setClosing] = useState(false);
  const [animIn, setAnimIn]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(null);
  const [search, setSearch]   = useState("");

  function openModal() {
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
  }
  function closeModal() {
    setAnimIn(false);
    setClosing(true);
    setSearch("");
    setTimeout(() => { setOpen(false); setClosing(false); }, 250);
  }

  useEffect(() => {
    const cachedCafes = sessionStorage.getItem("cafeList");
    const cachedTotal = sessionStorage.getItem("totalStats");
    if (cachedCafes) { setCafes(JSON.parse(cachedCafes)); setLoading(false); }
    if (cachedTotal) { setTotal(JSON.parse(cachedTotal)); }

    fetch(`${API_URL}?action=list`, { redirect:"follow" })
      .then(r => r.json())
      .then(d => {
        const list = d.cafes || [];
        setCafes(list);
        setLoading(false);
        sessionStorage.setItem("cafeList", JSON.stringify(list));
      })
      .catch(() => setLoading(false));

    fetch(`${API_URL}?action=total`, { redirect:"follow" })
      .then(r => r.json())
      .then(d => { setTotal(d); sessionStorage.setItem("totalStats", JSON.stringify(d)); })
      .catch(() => {});
  }, []);

  function select(cafe) {
    window.location.href = `?cafeId=${encodeURIComponent(cafe.id)}`;
  }

  const sorted = [...cafes]
    .filter(c => c.name.includes(search))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));

  return (
    <div style={{ background:"#f0f0f0", height:"100vh", display:"flex", justifyContent:"center", overflow:"hidden" }}>
    <div style={{ width:"100%", maxWidth:480, height:"100vh", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 2.5rem", gap:"1.8rem", position:"relative", overflow:"hidden" }}>

      <a href={HOME_URL} target="_blank" rel="noreferrer">
        <img src={LOGO_URL} alt="지소행" style={{ width:200, objectFit:"contain" }}/>
      </a>

      <div style={{ width:"100%", position:"relative", zIndex:100 }}>
        <button onClick={() => open ? closeModal() : openModal()} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:BLUE, borderRadius:50, padding:"14px 22px", border:"none", cursor:"pointer" }}>
          <span style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span className="material-symbols-outlined" style={{ fontSize:22, color:"#fff" }}>search</span>
            <span style={{ fontSize:17, color:"#fff", fontWeight:600 }}>지구 카페 찾기</span>
          </span>
          <span className="material-symbols-outlined" style={{ fontSize:22, color:"rgba(255,255,255,0.8)" }}>keyboard_arrow_down</span>
        </button>
      </div>

      <p style={{ fontSize:14, color:"#bbb", textAlign:"center", lineHeight:1.9, fontWeight:400 }}>
        지소행과 함께 종이팩 자원순환을 실천하는<br/>충무로의 지구카페들을 확인해보세요!
      </p>

      <div style={{ width:"100%", position:"relative", zIndex:100 }}>
        {(open || closing) && (
          <>
            <div onClick={closeModal} style={{
              position:"fixed", inset:0, zIndex:199,
              background:"rgba(0,0,0,0.4)",
              opacity: animIn ? 1 : 0,
              transition:"opacity .25s ease",
            }}/>

            <div style={{
              position:"fixed", inset:0, zIndex:200,
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"5vh 24px",
              pointerEvents: animIn ? "auto" : "none",
            }}>
              <div style={{
                width:"100%", maxWidth:400, height:"82vh",
                background:"#fff", borderRadius:24,
                boxShadow:"0 20px 60px rgba(0,0,0,0.25)",
                display:"flex", flexDirection:"column", overflow:"hidden",
                transform: animIn ? "scale(1) translateY(0)" : "scale(0.92) translateY(10px)",
                opacity: animIn ? 1 : 0,
                transition:"transform .25s cubic-bezier(0.34,1.56,0.64,1), opacity .2s ease",
              }}>

                {/* 검색 헤더 */}
                <div style={{ padding:"20px 20px 12px", flexShrink:0 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <span style={{ fontSize:17, color:"#0a1a2e", fontWeight:700 }}>지구 카페 찾기</span>
                    <button onClick={closeModal} style={{ background:"#f5f5f5", border:"none", borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                      <span className="material-symbols-outlined" style={{ fontSize:18, color:"#999" }}>close</span>
                    </button>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", background:"#f5f5f5", borderRadius:50, padding:"9px 16px", gap:8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:18, color:"#aaa" }}>search</span>
                    <input
                      type="text"
                      placeholder="카페 이름으로 찾기"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{ flex:1, border:"none", background:"transparent", fontSize:16, outline:"none", fontFamily:"Pretendard, sans-serif", color:"#222" }}
                    />
                    {search && (
                      <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#aaa" }}>✕</button>
                    )}
                  </div>
                </div>

                {/* 전체 통계 */}
                {total && (
                  <div style={{ padding:"12px 20px 14px", textAlign:"center", borderBottom:"1px solid #f0f0f0", flexShrink:0 }}>
                    <p style={{ fontSize:11.5, color:"#aaa", marginBottom:2, fontWeight:500 }}>
                      충무로 지구카페가 함께 모은 종이팩
                    </p>
                    <p style={{ fontSize:24, fontWeight:900, color:GREEN, letterSpacing:-1, lineHeight:1 }}>
                      {total.count.toLocaleString("ko-KR")}
                      <span style={{ fontSize:13, fontWeight:500, color:"#bbb", marginLeft:3 }}>개</span>
                    </p>
                  </div>
                )}

                {/* 카페 리스트 */}
                <div style={{ flex:1, overflowY:"auto", padding:"8px 16px 20px", WebkitOverflowScrolling:"touch" }}>
                  {loading ? (
                    <p style={{ padding:"1rem", textAlign:"center", fontSize:14, color:"#ccc" }}>지구카페 찾는 중...</p>
                  ) : sorted.map((cafe) => (
                    <div key={cafe.id} onClick={() => select(cafe)} style={{
                      background:"#f8f8f8", borderRadius:14, padding:"14px 16px",
                      marginBottom:8, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
                      transition:"background .12s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background="#f0f0f0"}
                      onMouseLeave={e => e.currentTarget.style.background="#f8f8f8"}
                    >
                      <span style={{ fontWeight:600, fontSize:14.5, color:"#222" }}>{cafe.name}</span>
                      <span className="material-symbols-outlined" style={{ fontSize:18, color:"#ccc" }}>chevron_right</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ position:"absolute", bottom:24, display:"flex", gap:20, zIndex:1 }}>
        <a href={INSTA_URL} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#bbb", textDecoration:"none" }}>인스타그램</a>
        <a href={HOME_URL} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#bbb", textDecoration:"none" }}>홈페이지</a>
        <a href={CONTACT_URL} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#bbb", textDecoration:"none" }}>문의하기</a>
      </div>
    </div>
    </div>
  );
}

function TotalStatsBox({ cafeName }) {
  const cached = sessionStorage.getItem("totalStats");
  const [total, setTotal] = useState(cached ? JSON.parse(cached) : null);

  useEffect(() => {
    fetch(`${API_URL}?action=total`, { redirect:"follow" })
      .then(r => r.json())
      .then(d => { setTotal(d); sessionStorage.setItem("totalStats", JSON.stringify(d)); })
      .catch(() => {});
  }, []);

  if (!total) return null;

  return (
    <div style={{ background:"#f0faf4", border:"1px solid #d8eee0", borderRadius:16, padding:"20px", marginBottom:20, textAlign:"center" }}>
      <span className="material-symbols-outlined" style={{ fontSize:26, color:GREEN, display:"block", marginBottom:8 }}>package_2</span>
      <p style={{ fontSize:12, color:"#999", marginBottom:6, fontWeight:500, lineHeight:1.5 }}>
        {cafeName}을 포함한 충무로 지구카페가<br/>지금까지 함께 모은 종이팩
      </p>
      <p style={{ fontSize:38, fontWeight:900, color:GREEN, letterSpacing:-2, lineHeight:1 }}>
        {Math.round(total.count).toLocaleString("ko-KR")}
        <span style={{ fontSize:16, fontWeight:500, color:"#aaa", marginLeft:4 }}>개</span>
      </p>
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
            <img src="/sticker6.png" alt="" style={{ width:120 }}/>
          </div>

          <div style={{ textAlign:"center", marginBottom:14 }}>
            <span style={{ display:"inline-block", background:"#e8f5ee", borderRadius:20, padding:"5px 16px", fontSize:13, color:GREEN, fontWeight:600 }}>
              종이팩이 다시 태어나는 곳
            </span>
          </div>

          <h1 style={{ fontSize:30, fontWeight:800, color:"#0a1a2e", lineHeight:1.2, marginBottom:20, textAlign:"center" }}>
            {data.cafe}
          </h1>

          <div style={{ display:"flex", gap:8, marginBottom:32 }}>
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
          <div style={{ marginBottom:32 }}>
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
          <div style={{ display:"flex", borderRadius:14, overflow:"hidden", border:"1px solid #eef2f8", marginBottom:32 }}>
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
  const cacheKey = `cafeDetail_${cafeId}`;
  const cached = sessionStorage.getItem(cacheKey);

  const [status, setStatus] = useState(cached ? "ok" : "loading");
  const [data, setData]     = useState(cached ? JSON.parse(cached) : null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    fetch(`${API_URL}?cafeId=${encodeURIComponent(cafeId)}`, { redirect:"follow" })
      .then(r => r.json())
      .then(d => {
        if (!d.cafe) { setErrMsg(`등록된 카페를 찾지 못했어요. (${cafeId})`); setStatus("error"); }
        else { setData(d); setStatus("ok"); sessionStorage.setItem(cacheKey, JSON.stringify(d)); }
      })
      .catch(e => { if (!cached) { setErrMsg(e.message); setStatus("error"); } });
  }, [cafeId]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error")   return <ErrorScreen detail={errMsg} />;
  return <CafePage data={data} />;
}