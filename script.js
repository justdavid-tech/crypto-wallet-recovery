let state = {
  pct: 0,
  recovered: 0,
  txCount: 0,
  traceCount: 1, // start at 1 instead of 0
  caseId: "—",
  analyst: "—",
  amount: 0,
};

const fill = document.getElementById("fill"),
  pct = document.getElementById("pct"),
  rec = document.getElementById("recovered"),
  txCountEl = document.getElementById("txCount"),
  traceCountEl = document.getElementById("traceCount"),
  explorerLink = document.getElementById("explorerLink"),
  logEl = document.getElementById("log"),
  caseEl = document.getElementById("caseId"),
  analystEl = document.getElementById("analyst"),
  amountEl = document.getElementById("amount"),
  txList = document.getElementById("txList");

function loadDashboard(e) {
  e.preventDefault();
  state.caseId = document.getElementById("formCaseId").value;
  state.analyst = document.getElementById("formAnalyst").value;
  state.amount = parseFloat(document.getElementById("formAmount").value) || 0;
  caseEl.textContent = state.caseId;
  analystEl.textContent = state.analyst;
  amountEl.textContent = "$" + state.amount.toLocaleString();

  document.getElementById("entryForm").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  updateUI();
  log("Case loaded: " + state.caseId + " | Analyst: " + state.analyst);
}

function log(msg) {
  const ts = new Date().toLocaleTimeString();
  logEl.innerHTML = `<div>[${ts}] ${msg}</div>` + logEl.innerHTML;
}

function startDemo() {
  if (state.pct > 0 && state.pct < 100) {
    log("Already running");
    return;
  }
  resetDemo();
  log("Run started");

  const stages = [
    { delay: 4000, addPct: 20, action: "Tracing initial wallets" },
    { delay: 5000, addPct: 20, action: "Scanning transaction graph" },
    { delay: 6000, addPct: 20, action: "Verifying chain hops" },
    { delay: 5000, addPct: 20, action: "Notifying custodial partner" },
    { delay: 7000, addPct: 20, action: "Partial recovery executed" },
  ];

  let i = 0;
  function nextStage() {
    if (i >= stages.length) {
      state.pct = 100;
      updateUI();
      log("Run completed");
      return;
    }
    const s = stages[i++];
    setTimeout(() => {
      log(s.action);
      animateTo(state.pct + s.addPct, s.delay / 2, () => {
        if (s.action.includes("Partial recovery")) {
          log(`Recovered ${state.recovered.toLocaleString()} of ${state.amount}`);
        }
        nextStage();
      });
    }, s.delay);
  }
  nextStage();
}

function animateTo(target, ms, cb) {
  const start = performance.now(),
    from = state.pct;
  function step(now) {
    const t = Math.min(1, (now - start) / ms);
    state.pct = Math.round(from + (target - from) * t);
    state.recovered = Math.round((state.pct / 100) * state.amount);
    updateUI();
    if (t < 1) requestAnimationFrame(step);
    else if (cb) cb();
  }
  requestAnimationFrame(step);
}

function updateUI() {
  fill.style.width = state.pct + "%";
  pct.textContent = state.pct + "%";
  rec.textContent = "$" + state.recovered.toLocaleString();
  txCountEl.textContent = state.txCount;
  traceCountEl.textContent = state.traceCount;
  caseEl.textContent = state.caseId;
  analystEl.textContent = state.analyst;
  amountEl.textContent = "$" + state.amount.toLocaleString();
  explorerLink.textContent = " Explorer link";
}

function resetDemo() {
  state.pct = 0;
  state.recovered = 0;
  state.txCount = 0;
  state.traceCount = 1;
  txList.innerHTML = "";
  logEl.innerHTML = "";
  updateUI();
  log("Reset");
}

// ------------------------------
// Generate Random Transactions
// ------------------------------
const sampleTx = {
  CashApp: ["Chicago, USA", "New York, USA", "London, UK"],
  PayPal: ["Madrid, Spain", "Paris, France", "Berlin, Germany"],
  Venmo: ["Los Angeles, USA", "Miami, USA", "Rome, Italy"],
  Zelle: ["Toronto, Canada", "Amsterdam, Netherlands", "Dallas, USA"],
  "Bank Transfer": ["Sydney, Australia", "Moscow, Russia", "Cape Town, SA"],
  Crypto: ["Tokyo, Japan", "Dubai, UAE", "Singapore"],
};

function generateTransactions() {
  txList.innerHTML = "";
  const method = state.caseId;
  const list = sampleTx[method] || ["Unknown"];

  for (let i = 0; i < 5; i++) {
    const loc = list[Math.floor(Math.random() * list.length)];
    const amount = `$${(Math.random() * 5000 + 50).toFixed(2)}`;
    const date = new Date().toLocaleString();
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();

    const div = document.createElement("div");
    div.className = "tx";
    div.textContent = `${date} | ${method} | ${loc} | ${amount} | TX-${id}`;
    txList.appendChild(div);
  }

  state.txCount += 5;
  updateUI();
  log("Generated 5 random transactions for " + method);
}
