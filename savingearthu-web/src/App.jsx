import { useState, useEffect, useRef } from "react";

const API_URL      = "https://script.google.com/macros/s/AKfycbyzE7WdVzzrdS7PhzyvponsP9wvtSxI9EroRozP12vVeCLtC1RPe_Rx1bKOORnxkzEy/exec";
const LOGO_URL     = "https://cdn.imweb.me/upload/S20230420b05ab2cbf2d03/17b01aa6bd13a.png";
const INTERVIEW_URL= "https://stibee.com/api/v1.0/emails/share/5VZxW3ytjo2n2O7uTRp-sVi4Uh9A-p0";
const RECYCLE_URL  = "https://savingearthu.org/actions/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=170908572&t=board";
const HOME_URL     = "https://savingearthu.org/";
const INSTA_URL    = "https://www.instagram.com/savingearthu/";
const MAP_URL      = "https://map.naver.com/p/favorite/myPlace/folder/11dff33693824487b7ff9cfcadea7c8c?c=15.00,0,0,0,dh";
const BG_IMG       = "bg.jpg";
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
    <div style={{ minHeight:"100vh", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
      <img src={LOGO_URL} alt="지소행" style={{ width:130 }}/>
      <p style={{ fontSize:15, color:"#ccc", fontWeight:400 }}>지구카페 찾는 중...</p>
    </div>
  );
}

function ErrorScreen({ detail }) {
  return (
    <div style={{ minHeight:"100vh", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"2rem", gap:8 }}>
      <p style={{ fontSize:15, color:"#aaa" }}>카페 정보를 찾을 수 없어요.</p>
      <p style={{ fontSize:13, color:"#ccc" }}>{detail}</p>
    </div>
  );
}

function HomeScreen() {
  const [cafes, setCafes]     = useState([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}?action=list`, { redirect:"follow" })
      .then(r => r.json())
      .then(d => { setCafes(d.cafes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function select(cafe) {
    window.location.href = `?cafeId=${encodeURIComponent(cafe.id)}`;
  }

  return (
    <div style={{ minHeight:"100vh", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem", gap:"1.8rem" }}>
      <img src={LOGO_URL} alt="지소행" style={{ width:200, objectFit:"contain" }}/>

      <div style={{ width:"100%", maxWidth:400, position:"relative", zIndex:100 }}>
        <button onClick={() => setOpen(o => !o)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:BLUE, borderRadius:50, padding:"14px 20px", border:"none", cursor:"pointer" }}>
          <span style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span className="material-symbols-outlined" style={{ fontSize:20, color:"#fff" }}>search</span>
            <span style={{ fontSize:16, color:"#fff", fontWeight:600 }}>지구 카페 찾기</span>
          </span>
          <span className="material-symbols-outlined" style={{ fontSize:20, color:"rgba(255,255,255,0.8)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .2s" }}>keyboard_arrow_down</span>
        </button>

        {open && (
          <>
            <div style={{ position:"fixed", inset:0, zIndex:99 }} onClick={() => setOpen(false)}/>
            <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, right:0, background:"#fff", borderRadius:16, boxShadow:"0 8px 32px rgba(0,0,0,0.1)", maxHeight:300, overflowY:"auto", border:"1.5px solid #e8e8e8", zIndex:100 }}>
              {loading ? (
                <p style={{ padding:"1rem", textAlign:"center", fontSize:14, color:"#ccc" }}>지구카페 찾는 중...</p>
              ) : cafes.map((cafe, i) => (
                <div key={cafe.id} onClick={() => select(cafe)}
                  style={{ padding:"14px 20px", cursor:"pointer", fontSize:15, color:"#222", borderBottom: i < cafes.length-1 ? "1px solid #f5f5f5" : "none", display:"flex", alignItems:"center", gap:10 }}
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

      <p style={{ fontSize:14, color:"#bbb", textAlign:"center", lineHeight:1.9, fontWeight:400 }}>
        지소행과 함께 종이팩 자원순환을 실천하는<br/>충무로의 지구카페들을 확인해보세요
      </p>
    </div>
  );
}

function CafePage({ data }) {
  const handleRef  = useRef(null);
  const isDragging = useRef(false);
  const startY     = useRef(0);
  const startTop   = useRef(0);
  const PHOTO_H    = 260;
  const MIN_TOP    = 60;
  const INIT_TOP   = PHOTO_H - 24;
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
    { icon:"water_drop", label:"종이팩",    value:fmt(data.count),  unit:"개"  },
    { icon:"forest",     label:"살린 나무", value:fmt(data.trees),  unit:"그루" },
    { icon:"scroll",     label:"재생 휴지", value:fmt(data.tissue), unit:"개"  },
  ];

  const FLOW_ROW1 = [
    { icon:"local_cafe",     label:"카페"        },
    { icon:"local_shipping", label:"지소행(수거)" },
    { icon:"factory",        label:"제지사"      },
  ];
  const FLOW_ROW2 = [
    { icon:"recycling",          label:"재생 휴지" },
    { icon:"volunteer_activism", label:"기후취약계층에게 전달" },
  ];

  return (
    <div style={{ width:"100%", height:"100vh", overflow:"hidden", position:"relative", background:"#fff" }}>

      {/* 상단 배경 사진 */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:PHOTO_H, overflow:"hidden", background:"#e8e8e8" }}>
        <img src={BG_IMG} alt="배경" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.25))" }}/>
        <a href="/" style={{ position:"absolute", top:16, left:16, background:"#fff", borderRadius:"50%", width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", textDecoration:"none" }}>
          <span className="material-symbols-outlined" style={{ fontSize:20, color:"#333" }}>arrow_back</span>
        </a>
      </div>

      {/* 바텀 시트 - 내부 스크롤 가능, 전체 화면 스크롤 없음 */}
      <div
        style={{
          position:"absolute", left:0, right:0,
          top: sheetTop, bottom:0,
          background:"#fff",
          borderRadius:"20px 20px 0 0",
          boxShadow:"0 -4px 24px rgba(0,0,0,0.1)",
          display:"flex", flexDirection:"column",
          transition:"top 0.3s ease",
        }}
      >
        {/* 핸들 - 오직 여기서만 드래그 */}
        <div
          ref={handleRef}
          onTouchStart={onHandleTouchStart}
          onTouchMove={onHandleTouchMove}
          onTouchEnd={onHandleTouchEnd}
          style={{ padding:"12px 0 8px", display:"flex", justifyContent:"center", cursor:"grab", flexShrink:0, touchAction:"none" }}
        >
          <div style={{ width:36, height:4, background:"#ddd", borderRadius:2 }}/>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div style={{ flex:1, overflowY:"auto", padding:"6px 20px 48px", WebkitOverflowScrolling:"touch" }}>

          {/* 태그 */}
          <div style={{ textAlign:"center", marginBottom:8 }}>
            <span style={{ display:"inline-block", background:"#e8f5ee", borderRadius:20, padding:"4px 16px", fontSize:12, color:GREEN, fontWeight:600 }}>
              2025년부터 함께하는 지구카페
            </span>
          </div>

          {/* 카페 이름 */}
          <h1 style={{ fontSize:28, fontWeight:800, color:"#0a1a2e", lineHeight:1.2, marginBottom:18, textAlign:"left" }}>
            {data.cafe}
          </h1>

          {/* 통계 - 숫자 옆에 단위 작게 */}
          <div style={{ display:"flex", gap:8, marginBottom:22 }}>
            {STATS.map((s,i) => (
              <div key={i} style={{ flex:1, background:"#f0faf4", borderRadius:14, padding:"14px 4px", textAlign:"center" }}>
                <span className="material-symbols-outlined" style={{ fontSize:24, color:GREEN, display:"block", marginBottom:5 }}>{s.icon}</span>
                <p style={{ fontSize:20, fontWeight:800, color:GREEN, lineHeight:1 }}>
                  {s.value}<span style={{ fontSize:11, color:"#aaa", fontWeight:500, marginLeft:2 }}>{s.unit}</span>
                </p>
                <p style={{ fontSize:12, color:"#888", marginTop:5 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* 자원순환 구조 */}
          <p style={{ fontSize:15, fontWeight:700, color:"#0a1a2e", marginBottom:12, textAlign:"center" }}>자원순환 구조</p>
          <div style={{ marginBottom:22 }}>
            {/* 1행: 3개 */}
            <div style={{ display:"flex", alignItems:"center", gap:2, marginBottom:6 }}>
              {FLOW_ROW1.map((f, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
                  <div style={{ flex:1, background:"#f0f9ff", borderRadius:10, padding:"10px 2px", textAlign:"center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize:20, color:BLUE, display:"block", marginBottom:4 }}>{f.icon}</span>
                    <p style={{ fontSize:10, color:"#0a6a8a", wordBreak:"keep-all", lineHeight:1.3 }}>{f.label}</p>
                  </div>
                  {i < FLOW_ROW1.length-1 && (
                    <span style={{ fontSize:16, color:BLUE, fontWeight:800, flexShrink:0, margin:"0 3px" }}>›</span>
                  )}
                </div>
              ))}
            </div>
            {/* 2행: 2개 - 왼쪽 첫번째 칸 아래에서 이어지게 */}
            <div style={{ display:"flex", alignItems:"center", gap:2 }}>
              {/* 첫 칸 너비만큼 여백 + 화살표 */}
              <div style={{ flex:1, display:"flex", justifyContent:"center", paddingTop:2 }}>
                <span style={{ fontSize:16, color:BLUE, fontWeight:800 }}>↓</span>
              </div>
              <div style={{ width:22, flexShrink:0 }}/>
              {/* 재생휴지 */}
              <div style={{ flex:1, background:"#f0f9ff", borderRadius:10, padding:"10px 2px", textAlign:"center" }}>
                <span className="material-symbols-outlined" style={{ fontSize:20, color:BLUE, display:"block", marginBottom:4 }}>{FLOW_ROW2[0].icon}</span>
                <p style={{ fontSize:10, color:"#0a6a8a" }}>{FLOW_ROW2[0].label}</p>
              </div>
              <span style={{ fontSize:16, color:BLUE, fontWeight:800, flexShrink:0, margin:"0 3px" }}>›</span>
              {/* 기후취약계층 */}
              <div style={{ flex:1, background:"#f0f9ff", borderRadius:10, padding:"10px 2px", textAlign:"center" }}>
                <span className="material-symbols-outlined" style={{ fontSize:20, color:BLUE, display:"block", marginBottom:4 }}>{FLOW_ROW2[1].icon}</span>
                <p style={{ fontSize:9, color:"#0a6a8a", wordBreak:"keep-all", lineHeight:1.3 }}>{FLOW_ROW2[1].label}</p>
              </div>
            </div>
          </div>

          {/* 함께하는 사람들 */}
          <p style={{ fontSize:15, fontWeight:700, color:"#0a1a2e", marginBottom:12, textAlign:"center" }}>함께하는 사람들</p>
          <div style={{ display:"flex", borderRadius:14, overflow:"hidden", border:"1px solid #eef2f8", marginBottom:22 }}>
            <div style={{ flex:1, background:"#f7fafe" }}>
              <img src={TEACHER_IMG} alt="황무연 선생님" style={{ width:"100%", height:110, objectFit:"cover", objectPosition:"center top", display:"block" }}/>
              <div style={{ padding:"12px 10px 14px", textAlign:"center" }}>
                <p style={{ fontSize:13, fontWeight:700, color:"#0a1a2e", marginBottom:5 }}>황무연 선생님</p>
                <p style={{ fontSize:11, color:"#888", lineHeight:1.7, marginBottom:7 }}>충무로 카페 종이팩을<br/>매일 수거하시는<br/>어르신 활동가</p>
                <a href={INTERVIEW_URL} target="_blank" rel="noreferrer" style={{ fontSize:11, fontWeight:700, color:BLUE, textDecoration:"none" }}>이야기 들으러가기 →</a>
              </div>
            </div>
            <div style={{ width:1, background:"#e8eef8", flexShrink:0 }}/>
            <div style={{ flex:1, background:"#f7fafe" }}>
              <img src={RECYCLE_IMG} alt="종이팩 다시쓰기" style={{ width:"100%", height:110, objectFit:"cover", objectPosition:"center", display:"block" }}/>
              <div style={{ padding:"12px 10px 14px", textAlign:"center" }}>
                <p style={{ fontSize:13, fontWeight:700, color:"#0a1a2e", marginBottom:5 }}>종이팩 다시쓰기</p>
                <p style={{ fontSize:11, color:"#888", lineHeight:1.7, marginBottom:7 }}>직접 충무로 카페 종이팩을<br/>수거하고 자원순환 과정을<br/>배우는 기업 ESG 봉사 프로그램</p>
                <a href={RECYCLE_URL} target="_blank" rel="noreferrer" style={{ fontSize:11, fontWeight:700, color:BLUE, textDecoration:"none" }}>활동 보러가기 →</a>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
            <a href={MAP_URL} target="_blank" rel="noreferrer" style={{ display:"block", width:"100%", padding:"16px", background:BLUE, borderRadius:50, textAlign:"center", fontSize:16, fontWeight:700, color:"#fff", textDecoration:"none" }}>
              다른 지구 카페 확인하기 →
            </a>
            <button onClick={share} style={{ width:"100%", padding:"16px", background:GREEN, borderRadius:50, border:"none", cursor:"pointer", fontSize:16, fontWeight:700, color:"#fff" }}>
              공유하기
            </button>
          </div>

          {/* 하단 로고 */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
            <img src={LOGO_URL} alt="지소행" style={{ width:110, objectFit:"contain" }}/>
            <div style={{ display:"flex", gap:20 }}>
              <a href={INSTA_URL} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#bbb", textDecoration:"none" }}>인스타그램</a>
              <a href={HOME_URL} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#bbb", textDecoration:"none" }}>홈페이지</a>
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