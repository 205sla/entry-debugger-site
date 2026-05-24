/* global React, ReactDOM */
/* DebugTabDemo — interactive demo for the 디버깅 탭 section.
   Renders the right-side debug panel of the Entry editor with the
   four sub-tabs (변수 / 리스트 / 신호 / 장면). */

const { useState, useMemo } = React;

// ---- Data ----
const VARIABLES = [
  { name: "현재 점수",      scope: "general", scopeLabel: "일반", value: 1240, type: "num" },
  { name: "남은 목숨",      scope: "general", scopeLabel: "일반", value: 3, type: "num" },
  { name: "보스 체력",      scope: "shared",  scopeLabel: "공유", value: 750, type: "num" },
  { name: "현재 라운드",    scope: "general", scopeLabel: "일반", value: 4, type: "num" },
  { name: "타이머",          scope: "real",    scopeLabel: "실시간", value: "42.13", type: "num" },
  { name: "내 코인",         scope: "local",   scopeLabel: "지역: 플레이어", value: 12, type: "num" },
  { name: "콤보 수",         scope: "local",   scopeLabel: "지역: 플레이어", value: 7, type: "num" },
  { name: "isPaused",        scope: "shared",  scopeLabel: "공유", value: "false", type: "bool" },
];

const LISTS = [
  {
    name: "이번 판 점수기록",
    scope: "general", scopeLabel: "일반",
    items: ["1240", "980", "1530", "420", "2100"]
  },
  {
    name: "획득 아이템",
    scope: "shared", scopeLabel: "공유",
    items: ["하트", "별", "별", "방패", "별", "코인"]
  },
  {
    name: "보스 패턴 큐",
    scope: "real", scopeLabel: "실시간",
    items: ["슬래시", "차지", "레이저", "슬래시"]
  },
];

const SIGNALS = [
  "게임 시작",
  "라운드 종료",
  "보스 등장",
  "플레이어 사망",
  "체크포인트",
  "아이템 획득",
  "BGM 전환",
];

const SCENES = [
  { name: "타이틀",      isCurrent: false, hue1: "#FFE7D6", hue2: "#FFB07A" },
  { name: "스테이지 1",  isCurrent: true,  hue1: "#DDF0FF", hue2: "#6FB35A" },
  { name: "스테이지 2",  isCurrent: false, hue1: "#FFEFF5", hue2: "#FF9DBE" },
  { name: "보스 전투",   isCurrent: false, hue1: "#3A2B5E", hue2: "#7558D6" },
  { name: "엔딩",        isCurrent: false, hue1: "#1F2025", hue2: "#444851" },
];

const SUB_TABS = [
  { id: "var",   label: "변수",   count: VARIABLES.length },
  { id: "list",  label: "리스트", count: LISTS.length },
  { id: "sig",   label: "신호",   count: SIGNALS.length },
  { id: "scene", label: "장면",   count: SCENES.length },
];

// ---- Component ----
function DebugTabDemo() {
  const [tab, setTab] = useState("var");
  const [vars, setVars] = useState(VARIABLES);
  const [lists, setLists] = useState(LISTS);
  const [openList, setOpenList] = useState(0);
  const [search, setSearch] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [currentScene, setCurrentScene] = useState(1);
  const [pulsedSignal, setPulsedSignal] = useState(null);

  const filteredVars = useMemo(
    () => vars.filter(v => v.name.includes(search)),
    [vars, search]
  );
  const filteredSignals = useMemo(
    () => SIGNALS.filter(s => s.includes(search)),
    [search]
  );

  const updateVarValue = (idx, newValue) => {
    setVars(prev => prev.map((v, i) => i === idx ? { ...v, value: newValue } : v));
  };

  const sendSignal = (s) => {
    setPulsedSignal(s);
    setTimeout(() => setPulsedSignal(null), 700);
  };

  // Stage hue based on current scene
  const sceneObj = SCENES[currentScene];

  return (
    <div className="demo-frame">
      {/* LEFT: live stage preview reacting to data */}
      <div className="demo-stage">
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <span className="tag is-mint">LIVE</span>
          <h4>현재 작품 상태</h4>
        </div>
        <p className="desc">
          오른쪽 패널에서 값을 바꾸거나 신호를 보내면, 엔트리 만들기 화면을 떠나지 않고 결과를 바로 확인할 수 있어요. 새로고침도, 변수 창을 다시 띄우는 일도 없어요.
        </p>

        <div className="stage-canvas" style={{
          background: `linear-gradient(180deg, ${sceneObj.hue1} 0%, ${sceneObj.hue2} 100%)`,
          minHeight: 220,
          border: "none",
          padding: 20,
          color: sceneObj.hue1 === "#1F2025" ? "#fff" : "var(--entry-ink)"
        }}>
          <div className="label" style={{color: "currentColor", opacity: 0.7}}>
            장면 · {sceneObj.name}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
            marginTop: 10
          }}>
            <StageStat label="점수" value={vars[0].value} />
            <StageStat label="목숨" value={"❤".repeat(Math.max(0, parseInt(vars[1].value) || 0))} />
            <StageStat label="라운드" value={vars[3].value} />
            <StageStat label="타이머" value={vars[4].value + "s"} mono />
          </div>

          {pulsedSignal && (
            <div style={{
              marginTop: 14,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255,157,190,0.95)",
              color: "#fff",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              alignSelf: "flex-start",
              animation: "pulse 0.7s ease-out"
            }}>
              📡 신호 발생: {pulsedSignal}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: debug panel */}
      <div className="demo-panel">
        <div className="demo-tabs">
          {SUB_TABS.map(t => (
            <button
              key={t.id}
              className={"dt" + (tab === t.id ? " is-active" : "")}
              onClick={() => { setTab(t.id); setEditingIdx(null); }}
            >
              {t.label}
            </button>
          ))}
          <div className="demo-tabs-right">
            <button className="refresh" title="새로고침" aria-label="새로고침">↻</button>
            <span className="status-pill">연결됨</span>
          </div>
        </div>

        <div className="demo-toolbar">
          <div className="search">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={
                tab === "var"   ? "변수 이름으로 검색" :
                tab === "list"  ? "리스트 이름으로 검색" :
                tab === "sig"   ? "신호 검색" :
                                  "장면 이름 검색"
              }
              style={{
                flex: 1, border: 0, outline: "none",
                background: "transparent",
                fontFamily: "inherit", fontSize: "12.5px",
                color: "var(--entry-ink)"
              }}
            />
          </div>
          {(tab === "var" || tab === "list") && (
            <span className="scope-chip">스코프: 전체</span>
          )}
        </div>

        <div className="demo-rows">
          {tab === "var" && filteredVars.map((v, i) => {
            const realIdx = vars.findIndex(x => x.name === v.name);
            const isEditing = editingIdx === realIdx;
            return (
              <div key={v.name} className="drow">
                <div className="name">
                  {v.name}
                  <span className={"sc " + v.scope}>{v.scopeLabel}</span>
                </div>
                <input
                  className={"val" + (isEditing ? " editing" : "")}
                  value={v.value}
                  onFocus={() => setEditingIdx(realIdx)}
                  onBlur={() => setEditingIdx(null)}
                  onChange={e => updateVarValue(realIdx, e.target.value)}
                />
                <div className="actions">
                  <button className="iconbtn" title="복사">⧉</button>
                </div>
              </div>
            );
          })}

          {tab === "var" && filteredVars.length === 0 && (
            <EmptyState text={`'${search}' 와 일치하는 변수가 없어요`} />
          )}

          {tab === "list" && (
            <div style={{display: "flex", flexDirection: "column", gap: 8, padding: 4}}>
              {lists.map((l, li) => (
                <div key={l.name} className="lrow">
                  <div className="lhead" onClick={() => setOpenList(openList === li ? -1 : li)}>
                    <span className="arr">{openList === li ? "▾" : "▸"}</span>
                    <span style={{flex: 1}}>{l.name}</span>
                    <span className={"sc " + l.scope}>{l.scopeLabel}</span>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 11,
                      color: "var(--fg-3)"
                    }}>{l.items.length}개</span>
                  </div>
                  {openList === li && (
                    <div className="lbody">
                      {l.items.map((it, ii) => (
                        <div className="li" key={ii}>
                          <span className="idx">{ii + 1}</span>
                          <span className="v">{it}</span>
                          <button className="iconbtn" style={{width: 22, height: 22}} title="삭제">×</button>
                        </div>
                      ))}
                      <div className="add">＋ 항목 추가</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "sig" && filteredSignals.map(s => (
            <div key={s} className="sigrow">
              <span className="ic">📡</span>
              <span style={{fontWeight: 600, color: "var(--entry-ink)"}}>{s}</span>
              <button className="send" onClick={() => sendSignal(s)}>
                보내기
              </button>
            </div>
          ))}

          {tab === "scene" && SCENES.map((sc, si) => (
            <div key={sc.name} className={"scrow" + (si === currentScene ? " is-current" : "")}>
              <div className="thumb" style={{
                background: `linear-gradient(180deg, ${sc.hue1} 0%, ${sc.hue2} 100%)`
              }} />
              <div>
                <div style={{fontWeight: 700, fontSize: 14, color: "var(--entry-ink)"}}>{sc.name}</div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: si === currentScene ? "var(--c205-mint-press)" : "var(--fg-3)"
                }}>
                  {si === currentScene ? "● 현재 장면" : `장면 ${si + 1}`}
                </div>
              </div>
              <button
                className="go"
                onClick={() => setCurrentScene(si)}
                disabled={si === currentScene}
                style={si === currentScene ? {
                  opacity: 0.4, cursor: "default"
                } : null}
              >
                {si === currentScene ? "활성" : "이동 →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StageStat({ label, value, mono }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(6px)",
      borderRadius: 8,
      padding: "8px 10px",
      color: "var(--entry-ink)"
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.06em",
        color: "var(--fg-3)",
        textTransform: "uppercase"
      }}>{label}</div>
      <div style={{
        fontWeight: 700,
        fontSize: 18,
        fontFamily: mono ? "var(--font-mono)" : "var(--font-num)",
        marginTop: 2
      }}>{value}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{
      padding: "40px 20px",
      textAlign: "center",
      color: "var(--fg-3)",
      fontSize: 13,
      fontFamily: "var(--font-mono)"
    }}>
      <div style={{fontSize: 28, marginBottom: 6}}>⌕</div>
      {text}
    </div>
  );
}

// ---- Mount ----
const debugDemoRoot = document.getElementById("debug-demo-root");
if (debugDemoRoot) {
  ReactDOM.createRoot(debugDemoRoot).render(<DebugTabDemo />);
}
