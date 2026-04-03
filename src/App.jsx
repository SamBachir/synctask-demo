import React, { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  CircleDollarSign,
  ClipboardList,
  FileWarning,
  MessageSquareWarning,
  ShieldAlert,
  Wallet,
} from 'lucide-react'

const projects = [
  {
    id: 'moxy',
    name: 'Moxy Hotel',
    client: 'Builder Co',
    contractValue: 6100000,
    approvedVO: 420000,
    pendingVO: 1720000,
    unissuedVO: 185000,
    costsToDate: 4580000,
    forecastFinalCost: 5750000,
    marginForecast: 12.8,
    cashReceived: 3970000,
    cashOutstanding: 740000,
    retentionHeld: 198000,
    delayNotices: 4,
    openRFIs: 11,
    risk: 'High',
    health: 61,
    insights: [
      {
        id: 'ins-1',
        severity: 'critical',
      title: '$185k is still unissued and at risk of becoming unrecoverable',
reason: 'Three variation items remain in draft and are older than 14 days. Immediate issuance is required to protect entitlement.',
        action: 'variation',
      },
      {
        id: 'ins-2',
        severity: 'warning',
       title: 'Cashflow turns negative in 3 weeks without intervention',
reason: 'Delayed certification and upcoming procurement are creating a funding gap that will impact delivery.',
        action: 'commercial',
      },
      {
        id: 'ins-3',
        severity: 'warning',
     title: '2 overdue RFIs are now impacting programme and recoverability',
reason: 'Outstanding consultant responses are delaying progress and may affect variation entitlement and claim position.',
        action: 'rfi',
      },
    ],
  },
  {
    id: 'chalmers',
    name: '2 Chalmers Crescent',
    client: 'Urban Build',
    contractValue: 2480000,
    approvedVO: 120000,
    pendingVO: 260000,
    unissuedVO: 45000,
    costsToDate: 1390000,
    forecastFinalCost: 2210000,
    marginForecast: 10.9,
    cashReceived: 1290000,
    cashOutstanding: 310000,
    retentionHeld: 72000,
    delayNotices: 1,
    openRFIs: 4,
    risk: 'Medium',
    health: 78,
    insights: [
      {
        id: 'ins-4',
        severity: 'warning',
        title: 'Long-lead FCU procurement exposed by 2 weeks',
        reason: 'Approval timing is now impacting the manufacturing window.',
        action: 'commercial',
      },
      {
        id: 'ins-5',
        severity: 'info',
        title: '1 pending VO needs cost backup',
        reason: 'The change is drafted, but labour and subcontract support need attaching.',
        action: 'variation',
      },
    ],
  },
]

function currency(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

function MetricCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="card metric-card">
      <div>
        <div className="label">{title}</div>
        <div className="metric">{value}</div>
        <div className="subtle">{subtitle}</div>
      </div>
      <div className="icon-shell">
        <Icon size={18} />
      </div>
    </div>
  )
}

function InsightCard({ insight, onClick }) {
  return (
    <button className={`insight ${insight.severity}`} onClick={onClick}>
      <div className="insight-header">
        <AlertTriangle size={16} />
        <span className="insight-pill">{insight.severity}</span>
      </div>
      <div className="insight-title">{insight.title}</div>
      <div className="subtle">{insight.reason}</div>
    </button>
  )
}

function SectionCard({ title, children, right }) {
  return (
    <div className="card section-card">
      <div className="section-head">
        <h3>{title}</h3>
        {right}
      </div>
      {children}
    </div>
  )
}

export default function App() {
  const [projectId, setProjectId] = useState('moxy')
  const [screen, setScreen] = useState('dashboard')

  const project = useMemo(
    () => projects.find((p) => p.id === projectId) || projects[0],
    [projectId]
  )

  const netCashGap = project.costsToDate - project.cashReceived
  const commercialAtRisk = project.pendingVO + project.unissuedVO

  const go = (next) => setScreen(next)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">SYNCTASK</div>
          <div className="subtle brand-sub">Contractor control centre</div>
        </div>

        <nav className="nav">
          <button className={`nav-btn ${screen === 'dashboard' ? 'active' : ''}`} onClick={() => go('dashboard')}>Dashboard</button>
          <button className={`nav-btn ${screen === 'variation' ? 'active' : ''}`} onClick={() => go('variation')}>Variation Builder</button>
          <button className={`nav-btn ${screen === 'rfi' ? 'active' : ''}`} onClick={() => go('rfi')}>RFI Builder</button>
          <button className={`nav-btn ${screen === 'commercial' ? 'active' : ''}`} onClick={() => go('commercial')}>Commercial</button>
          <button className={`nav-btn ${screen === 'weekly' ? 'active' : ''}`} onClick={() => go('weekly')}>Weekly Report</button>
        </nav>

        <div className="project-list">
          <div className="label">Projects</div>
          {projects.map((p) => (
            <button
              key={p.id}
              className={`project-chip ${p.id === projectId ? 'active' : ''}`}
              onClick={() => {
                setProjectId(p.id)
                setScreen('dashboard')
              }}
            >
              <Briefcase size={14} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main">
        <header className="hero">
          <div>
            <div className="eyebrow">Signature dashboard</div>
           <h1>Know where profit is leaking before the job bites back</h1>
            <p>
  Synctask gives trade contractors one control centre for variations, RFIs, cashflow risk, and weekly reporting.
</p>
          </div>
          {screen !== 'dashboard' && (
            <button className="ghost-btn" onClick={() => go('dashboard')}>
              <ArrowLeft size={16} /> Back to dashboard
            </button>
          )}
        </header>

        {screen === 'dashboard' && (
          <>
            <div className="grid insights-grid">
              {project.insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} onClick={() => go(insight.action)} />
              ))}
            </div>

            <div className="grid metrics-grid">
              <MetricCard
                title="Pending Variations"
                value={currency(project.pendingVO)}
                subtitle="Not yet approved"
                icon={FileWarning}
              />
              <MetricCard
                title="Commercial At Risk"
                value={currency(commercialAtRisk)}
                subtitle="Pending + unissued exposure"
                icon={ShieldAlert}
              />
              <MetricCard
                title="Net Cash Gap"
                value={currency(netCashGap)}
                subtitle="Cost incurred vs cash received"
                icon={Wallet}
              />
              <MetricCard
                title="Forecast Margin"
                value={`${project.marginForecast}%`}
                subtitle="Projected final margin"
                icon={CircleDollarSign}
              />
            </div>

            <div className="grid main-grid">
              <SectionCard
                title="Project Pulse"
                right={<span className={`risk-pill ${project.risk.toLowerCase()}`}>{project.risk} risk</span>}
              >
                <div className="pulse-grid">
                  <div className="pulse-box">
                    <div className="label">Project health</div>
                    <div className="metric">{project.health}%</div>
                  </div>
                  <div className="pulse-box">
                    <div className="label">Open RFIs</div>
                    <div className="metric">{project.openRFIs}</div>
                  </div>
                  <div className="pulse-box">
                    <div className="label">Delay notices</div>
                    <div className="metric">{project.delayNotices}</div>
                  </div>
                </div>
                <div className="summary-box">
                  <strong>AI summary</strong>
                  <p>
                    This project is commercially exposed by {currency(commercialAtRisk)}.
                    Immediate focus should be variation issuance, overdue RFI resolution,
                    and claim timing.
                  </p>
                </div>
              </SectionCard>

              <SectionCard title="Quick Actions">
                <div className="quick-actions">
                  <button className="action-btn" onClick={() => go('variation')}>
                <FileWarning size={16} /> Issue Variation Claim <ArrowUpRight size={14} />
                  </button>
                  <button className="action-btn" onClick={() => go('rfi')}>
                    <MessageSquareWarning size={16} /> Raise Commercial RFI <ArrowUpRight size={14} />
                  </button>
                  <button className="action-btn" onClick={() => go('commercial')}>
                    <Wallet size={16} /> Review Cashflow Exposure <ArrowUpRight size={14} />
                  </button>
                  <button className="action-btn" onClick={() => go('weekly')}>
                    <ClipboardList size={16} /> Generate Builder Report <ArrowUpRight size={14} />
                  </button>
                </div>
              </SectionCard>
            </div>

            <div className="grid lower-grid">
              <SectionCard title="Claim vs Cost">
                <div className="line-item"><span>Costs to date</span><strong>{currency(project.costsToDate)}</strong></div>
                <div className="line-item"><span>Cash received</span><strong>{currency(project.cashReceived)}</strong></div>
                <div className="line-item"><span>Cash outstanding</span><strong>{currency(project.cashOutstanding)}</strong></div>
                <div className="line-item top-rule"><span>Exposure gap</span><strong>{currency(netCashGap)}</strong></div>
              </SectionCard>

              <SectionCard title="Variation Stack">
                <div className="line-item"><span>Approved</span><strong>{currency(project.approvedVO)}</strong></div>
                <div className="line-item"><span>Pending</span><strong>{currency(project.pendingVO)}</strong></div>
                <div className="line-item"><span>Unissued</span><strong>{currency(project.unissuedVO)}</strong></div>
                <div className="line-item top-rule"><span>Potential recovery</span><strong>{currency(project.approvedVO + commercialAtRisk)}</strong></div>
              </SectionCard>
            </div>
          </>
        )}

        {screen === 'variation' && (
          <SectionCard title="Variation Claim Builder">
            <div className="form-grid">
              <input className="field" placeholder="Original scope" />
              <input className="field" placeholder="Changed scope" />
              <input className="field" placeholder="Cause of change" />
              <input className="field" placeholder="Estimated cost impact" />
            </div>
            <div className="summary-box">
              <strong>Generated outcome</strong>
              <p>
                Formal VO summary, entitlement basis, time impact, approval request,
                and linked commercial exposure entry.
              </p>
            </div>
            <div className="btn-row">
              <button className="primary-btn">Generate claim</button>
              <button className="ghost-btn">Save draft</button>
            </div>
          </SectionCard>
        )}

        {screen === 'rfi' && (
          <SectionCard title="Commercial RFI Builder">
            <div className="form-grid">
              <input className="field" placeholder="Issue summary" />
              <input className="field" placeholder="Drawing / spec reference" />
              <input className="field" placeholder="Potential cost / time impact" />
              <input className="field" placeholder="Response required by" />
            </div>
            <div className="summary-box">
              <strong>Generated outcome</strong>
              <p>
                Clean RFI draft, transmittal wording, commercial exposure flag,
                and optional link to VO or delay path.
              </p>
            </div>
            <div className="btn-row">
              <button className="primary-btn">Create RFI</button>
              <button className="ghost-btn">Save draft</button>
            </div>
          </SectionCard>
        )}

        {screen === 'commercial' && (
          <div className="grid metrics-grid">
            <MetricCard title="Cash Received" value={currency(project.cashReceived)} subtitle="Received to date" icon={CircleDollarSign} />
            <MetricCard title="Cash Outstanding" value={currency(project.cashOutstanding)} subtitle="Submitted but unpaid" icon={Wallet} />
            <MetricCard title="Retention Held" value={currency(project.retentionHeld)} subtitle="Still locked up" icon={ShieldAlert} />
            <MetricCard title="Forecast Final Cost" value={currency(project.forecastFinalCost)} subtitle="Projected final cost" icon={FileWarning} />
          </div>
        )}

        {screen === 'weekly' && (
          <SectionCard title="Weekly Report Generator">
            <div className="form-grid">
              <input className="field" placeholder="Work completed this week" />
              <input className="field" placeholder="Labour on site" />
              <input className="field" placeholder="Current issues / constraints" />
              <input className="field" placeholder="Planned works next week" />
            </div>
            <div className="summary-box">
              <strong>Generated outcome</strong>
              <p>
                Builder-ready weekly report with current status, constraints,
                next steps, and internal commercial notes.
              </p>
            </div>
            <div className="btn-row">
              <button className="primary-btn">Generate report</button>
              <button className="ghost-btn">Save draft</button>
            </div>
          </SectionCard>
        )}
      </main>
    </div>
  )
}
