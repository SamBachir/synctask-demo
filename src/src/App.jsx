import React, { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  CircleDollarSign,
  ClipboardList,
  FileWarning,
  FolderKanban,
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
    openRFIs: 2,
    risk: 'High',
    health: 61,
    insights: [
      {
        id: 'ins-1',
        severity: 'critical',
        title: '$185,000 is unissued and at risk of being time-barred',
        reason:
          'Three variation items remain in draft beyond 14 days and require immediate submission to protect entitlement.',
        action: 'variation',
      },
      {
        id: 'ins-2',
        severity: 'warning',
        title: 'Cashflow turns negative in 3 weeks without intervention',
        reason:
          'Delayed certification and upcoming procurement are creating a $610,000 funding gap that will affect delivery.',
        action: 'commercial',
      },
      {
        id: 'ins-3',
        severity: 'warning',
        title: '2 overdue RFIs are impacting programme and recoverability',
        reason:
          'Outstanding consultant responses are delaying fit-off and may prejudice variation entitlement.',
        action: 'rfi',
      },
      {
        id: 'ins-4',
        severity: 'info',
        title: 'Weekly report draft is not issued for current cycle',
        reason:
          'Field notes are available, but builder-ready weekly reporting is not yet issued for this period.',
        action: 'weekly',
      },
    ],
    sampleVariation: {
      project: 'Moxy Hotel',
      title: 'Unissued variation items at risk of time bar',
      scope:
        'Additional works associated with late coordinated design issue and unresolved riser changes.',
      reason:
        'Commercial risk identified from dashboard insight and delayed information.',
      amount: 185000,
      recommendation:
        'Immediate submission is recommended to protect entitlement and preserve recovery position.',
    },
    sampleRfi: {
      project: 'Moxy Hotel',
      issue:
        'Consultant confirmation required for revised riser arrangement and access impacts.',
      drawing: 'M13 / Coordinated Set Rev IFC',
      impact:
        'Delays fit-off in affected zones and may impact variation entitlement.',
      dueDate: '2026-04-18',
      note:
        'Commercial protection wording required due to programme and claim implications.',
    },
    sampleCommercial: {
      gap: 610000,
      summary:
        'Production is running ahead of recovery. Negative cash position forecast within 3 weeks unless certification timing improves.',
      actions: [
        'Escalate outstanding certification items',
        'Issue unsubmitted variations immediately',
        'Review procurement timing against next claim window',
      ],
    },
    sampleWeekly: {
      labour: '18 operatives on site',
      completed:
        'Level 5 fit-off, riser coordination review, plantroom containment complete',
      issues:
        'Overdue RFIs affecting two zones, delayed consultant sign-off on riser change',
      nextWeek:
        'Continue fit-off, issue outstanding VO, close consultant responses',
      note:
        'Commercial exposure remains tied to unissued variations and delayed certification.',
    },
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
    openRFIs: 1,
    risk: 'Medium',
    health: 78,
    insights: [
      {
        id: 'ins-5',
        severity: 'warning',
        title: '$45,000 remains unissued and needs immediate review',
        reason:
          'One pending change is drafted but not yet submitted and requires cost support.',
        action: 'variation',
      },
      {
        id: 'ins-6',
        severity: 'info',
        title: 'Long-lead procurement needs approval this week',
        reason:
          'Approval timing is now affecting manufacturing lead time for FCU package.',
        action: 'commercial',
      },
    ],
    sampleVariation: {
      project: '2 Chalmers Crescent',
      title: 'Pending variation requiring cost backup',
      scope:
        'Additional coordination and revised install sequence due to approval delays.',
      reason:
        'Late approvals impacting planned procurement and labour sequencing.',
      amount: 45000,
      recommendation:
        'Complete support backup and submit this week to avoid revenue leakage.',
    },
    sampleRfi: {
      project: '2 Chalmers Crescent',
      issue: 'Clarify approval status for FCU schedule and ceiling access conflict.',
      drawing: 'Mechanical Coordination Mark-Up 06',
      impact: 'Potential delay to procurement release and install sequence.',
      dueDate: '2026-04-16',
      note:
        'Commercial note to preserve time and cost position if response is delayed.',
    },
    sampleCommercial: {
      gap: 100000,
      summary:
        'Project remains stable, but procurement timing needs closer alignment with claim timing.',
      actions: [
        'Lock in FCU approvals',
        'Submit pending variation support',
        'Protect next claim timing with supporting records',
      ],
    },
    sampleWeekly: {
      labour: '11 operatives on site',
      completed:
        'FCU rough-in, riser coordination, services reticulation in two zones',
      issues: 'Pending approvals on FCU package',
      nextWeek:
        'Release procurement, continue rough-in, close approval comments',
      note:
        'Commercial exposure remains manageable if approvals land this week.',
    },
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
  const [variationDraft, setVariationDraft] = useState(null)
  const [rfiDraft, setRfiDraft] = useState(null)
  const [commercialDraft, setCommercialDraft] = useState(null)
  const [weeklyDraft, setWeeklyDraft] = useState(null)
  const [claimStatus, setClaimStatus] = useState(null)
  const [variations, setVariations] = useState([])

  const project = useMemo(
    () => projects.find((p) => p.id === projectId) || projects[0],
    [projectId]
  )

  const projectRegister = useMemo(
    () => variations.filter((v) => v.projectId === project.id),
    [variations, project.id]
  )

  const addedToPending = projectRegister
    .filter((v) => v.status === 'Submitted' || v.status === 'Unsubmitted')
    .reduce((sum, v) => sum + v.amount, 0)

  const adjustedPendingVO = project.pendingVO + addedToPending
  const adjustedUnissuedVO = Math.max(project.unissuedVO - addedToPending, 0)
  const adjustedCommercialExposure = adjustedPendingVO + adjustedUnissuedVO
  const netCashGap = project.costsToDate - project.cashReceived
  const potentialRecovery = project.approvedVO + adjustedCommercialExposure

  const openVariation = () => {
    setClaimStatus(null)
    setVariationDraft({ ...project.sampleVariation })
    setScreen('variation')
  }

  const openRfi = () => {
    setRfiDraft({ ...project.sampleRfi })
    setScreen('rfi')
  }

  const openCommercial = () => {
    setCommercialDraft({ ...project.sampleCommercial })
    setScreen('commercial')
  }

  const openWeekly = () => {
    setWeeklyDraft({ ...project.sampleWeekly, project: project.name })
    setScreen('weekly')
  }

  const goFromInsight = (action) => {
    if (action === 'variation') openVariation()
    if (action === 'rfi') openRfi()
    if (action === 'commercial') openCommercial()
    if (action === 'weekly') openWeekly()
  }

  const generateVariationClaim = () => {
    if (!variationDraft) return
    const registerItem = {
      id: Date.now(),
      projectId: project.id,
      project: variationDraft.project,
      title: variationDraft.title,
      scope: variationDraft.scope,
      reason: variationDraft.reason,
      amount: variationDraft.amount,
      status: 'Submitted',
      createdAt: new Date().toLocaleDateString('en-AU'),
    }
    setVariations((prev) => [registerItem, ...prev])
    setClaimStatus('Variation claim generated, logged, and added to the register.')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">SYNCTASK</div>
          <div className="subtle brand-sub">Commercial command centre</div>
        </div>

        <nav className="nav">
          <button className={`nav-btn ${screen === 'dashboard' ? 'active' : ''}`} onClick={() => setScreen('dashboard')}>Dashboard</button>
          <button className={`nav-btn ${screen === 'variation' ? 'active' : ''}`} onClick={openVariation}>Variation Builder</button>
          <button className={`nav-btn ${screen === 'rfi' ? 'active' : ''}`} onClick={openRfi}>RFI Builder</button>
          <button className={`nav-btn ${screen === 'commercial' ? 'active' : ''}`} onClick={openCommercial}>Commercial</button>
          <button className={`nav-btn ${screen === 'weekly' ? 'active' : ''}`} onClick={openWeekly}>Weekly Report</button>
          <button className={`nav-btn ${screen === 'variation-register' ? 'active' : ''}`} onClick={() => setScreen('variation-register')}>
            Variation Register
          </button>
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
            <div className="eyebrow">Executive dashboard</div>
            <h1>Know where profit is leaking before the job bites back</h1>
            <p>
              Synctask gives trade contractors one control centre for variations, RFIs,
              cashflow risk, and weekly reporting.
            </p>
          </div>
          {screen !== 'dashboard' && (
            <button className="ghost-btn" onClick={() => setScreen('dashboard')}>
              <ArrowLeft size={16} /> Back to dashboard
            </button>
          )}
        </header>

        {screen === 'dashboard' && (
          <>
            <div className="grid insights-grid">
              {project.insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} onClick={() => goFromInsight(insight.action)} />
              ))}
            </div>

            <div className="grid metrics-grid">
              <MetricCard title="Pending Variations" value={currency(adjustedPendingVO)} subtitle="Including generated claims" icon={FileWarning} />
              <MetricCard title="Commercial Exposure" value={currency(adjustedCommercialExposure)} subtitle="Pending + unissued value" icon={ShieldAlert} />
              <MetricCard title="Net Cash Gap" value={currency(netCashGap)} subtitle="Cost incurred vs cash received" icon={Wallet} />
              <MetricCard title="Forecast Margin" value={`${project.marginForecast}%`} subtitle="Projected final margin" icon={CircleDollarSign} />
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
                  <strong>Register impact</strong>
                  <p>
                    {projectRegister.length === 0
                      ? 'No generated variations are currently logged against this project.'
                      : `${projectRegister.length} generated variation ${projectRegister.length === 1 ? 'claim is' : 'claims are'} now included in dashboard totals.`}
                  </p>
                </div>
              </SectionCard>

              <SectionCard title="Quick Actions">
                <div className="quick-actions">
                  <button className="action-btn" onClick={openVariation}>
                    <FileWarning size={16} /> Issue Variation Claim ({currency(project.unissuedVO)} at risk) <ArrowUpRight size={14} />
                  </button>
                  <button className="action-btn" onClick={openRfi}>
                    <MessageSquareWarning size={16} /> Resolve {project.openRFIs} overdue RFIs <ArrowUpRight size={14} />
                  </button>
                  <button className="action-btn" onClick={openCommercial}>
                    <Wallet size={16} /> Review Cashflow Exposure ({currency(netCashGap)} gap) <ArrowUpRight size={14} />
                  </button>
                  <button className="action-btn" onClick={openWeekly}>
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
                <div className="line-item"><span>Pending</span><strong>{currency(adjustedPendingVO)}</strong></div>
                <div className="line-item"><span>Unissued</span><strong>{currency(adjustedUnissuedVO)}</strong></div>
                <div className="line-item top-rule"><span>Potential recovery</span><strong>{currency(potentialRecovery)}</strong></div>
              </SectionCard>
            </div>
          </>
        )}

        {screen === 'variation' && (
          <SectionCard title="Variation Claim Builder">
            <div className="summary-box">
              <strong>Auto-generated variation summary</strong>
              <p>
                {variationDraft
                  ? `${currency(variationDraft.amount)} remains unissued and is at risk of becoming unrecoverable. ${variationDraft.reason}`
                  : 'No variation draft selected yet. Click the variation action from the dashboard to prefill this screen.'}
              </p>
            </div>

            <div className="form-grid">
              <input className="field" placeholder="Original scope" value={variationDraft?.title || ''} readOnly />
              <input className="field" placeholder="Changed scope" value={variationDraft?.scope || ''} readOnly />
              <input className="field" placeholder="Cause of change" value={variationDraft?.reason || ''} readOnly />
              <input className="field" placeholder="Estimated cost impact" value={variationDraft ? currency(variationDraft.amount) : ''} readOnly />
            </div>

            <div className="summary-box">
              <strong>Generated Variation Claim</strong>
              <p><b>Project:</b><br />{variationDraft?.project || 'Selected project'}</p>
              <p><b>Scope Change:</b><br />{variationDraft?.scope || 'Variation scope to be confirmed'}</p>
              <p><b>Cause:</b><br />{variationDraft?.reason || 'Commercial risk identified from dashboard insight'}</p>
              <p><b>Cost Impact:</b><br />{variationDraft ? currency(variationDraft.amount) : '$0'}</p>
              <p><b>Recommendation:</b><br />{variationDraft?.recommendation || 'Immediate submission is recommended to protect entitlement.'}</p>
            </div>

            {claimStatus && (
              <div className="summary-box">
                <strong>Status</strong>
                <p>{claimStatus}</p>
              </div>
            )}

            <div className="btn-row">
              <button className="primary-btn" onClick={generateVariationClaim}>
                Generate claim
              </button>
              <button className="ghost-btn" onClick={() => setScreen('variation-register')}>
                View register
              </button>
            </div>
          </SectionCard>
        )}

        {screen === 'variation-register' && (
          <SectionCard
            title="Variation Register"
            right={<span className="risk-pill medium">{projectRegister.length} logged</span>}
          >
            {projectRegister.length === 0 ? (
              <div className="summary-box">
                <strong>No variations logged yet</strong>
                <p>Generate a variation claim from the dashboard or variation builder to populate this register.</p>
              </div>
            ) : (
              <div className="register-list">
                {projectRegister.map((v) => (
                  <div key={v.id} className="register-item">
                    <div>
                      <div className="register-title">{v.title}</div>
                      <div className="subtle">{v.project} · {v.createdAt}</div>
                    </div>
                    <div className="register-meta">
                      <span className="register-status">{v.status}</span>
                      <strong>{currency(v.amount)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {screen === 'rfi' && (
          <SectionCard title="Commercial RFI Builder">
            <div className="summary-box">
              <strong>Auto-generated RFI summary</strong>
              <p>
                {rfiDraft
                  ? `${rfiDraft.issue} ${rfiDraft.note}`
                  : 'No RFI draft selected yet. Click the RFI action from the dashboard to prefill this screen.'}
              </p>
            </div>

            <div className="form-grid">
              <input className="field" placeholder="Issue summary" value={rfiDraft?.issue || ''} readOnly />
              <input className="field" placeholder="Drawing / spec reference" value={rfiDraft?.drawing || ''} readOnly />
              <input className="field" placeholder="Potential cost / time impact" value={rfiDraft?.impact || ''} readOnly />
              <input className="field" placeholder="Response required by" value={rfiDraft?.dueDate || ''} readOnly />
            </div>

            <div className="summary-box">
              <strong>Generated Commercial RFI</strong>
              <p><b>Project:</b><br />{rfiDraft?.project || 'Selected project'}</p>
              <p><b>Issue:</b><br />{rfiDraft?.issue || 'Issue to be confirmed'}</p>
              <p><b>Reference:</b><br />{rfiDraft?.drawing || 'Drawing / spec reference pending'}</p>
              <p><b>Commercial Impact:</b><br />{rfiDraft?.impact || 'Programme and entitlement impact to be assessed'}</p>
              <p><b>Recommendation:</b><br />Immediate consultant response required with commercial rights reserved.</p>
            </div>

            <div className="btn-row">
              <button className="primary-btn" onClick={() => alert('Commercial RFI generated and logged')}>
                Generate RFI
              </button>
              <button className="ghost-btn" onClick={() => setScreen('dashboard')}>Return to dashboard</button>
            </div>
          </SectionCard>
        )}

        {screen === 'commercial' && (
          <>
            <div className="grid metrics-grid">
              <MetricCard title="Cash Received" value={currency(project.cashReceived)} subtitle="Received to date" icon={CircleDollarSign} />
              <MetricCard title="Cash Outstanding" value={currency(project.cashOutstanding)} subtitle="Submitted but unpaid" icon={Wallet} />
              <MetricCard title="Retention Held" value={currency(project.retentionHeld)} subtitle="Still locked up" icon={ShieldAlert} />
              <MetricCard title="Forecast Final Cost" value={currency(project.forecastFinalCost)} subtitle="Projected final cost" icon={FileWarning} />
            </div>

            <SectionCard title="Commercial Review">
              <div className="summary-box">
                <strong>Commercial Summary</strong>
                <p>{commercialDraft?.summary || 'Commercial snapshot not prepared yet.'}</p>
              </div>

              <div className="summary-box">
                <strong>Recommended Actions</strong>
                <p>{commercialDraft?.actions?.[0] || 'No action listed'}<br />{commercialDraft?.actions?.[1] || ''}<br />{commercialDraft?.actions?.[2] || ''}</p>
              </div>
            </SectionCard>
          </>
        )}

        {screen === 'weekly' && (
          <SectionCard title="Weekly Report Generator">
            <div className="summary-box">
              <strong>Builder-ready weekly summary</strong>
              <p>
                Weekly report for {weeklyDraft?.project || 'selected project'} prepared from stored field notes and commercial issues.
              </p>
            </div>

            <div className="form-grid">
              <input className="field" placeholder="Labour on site" value={weeklyDraft?.labour || ''} readOnly />
              <input className="field" placeholder="Work completed this week" value={weeklyDraft?.completed || ''} readOnly />
              <input className="field" placeholder="Current issues / constraints" value={weeklyDraft?.issues || ''} readOnly />
              <input className="field" placeholder="Planned works next week" value={weeklyDraft?.nextWeek || ''} readOnly />
            </div>

            <div className="summary-box">
              <strong>Commercial Note</strong>
              <p>{weeklyDraft?.note || 'No commercial note available.'}</p>
            </div>

            <div className="btn-row">
              <button className="primary-btn" onClick={() => alert('Builder report generated and logged')}>
                Generate report
              </button>
              <button className="ghost-btn" onClick={() => setScreen('dashboard')}>Return to dashboard</button>
            </div>
          </SectionCard>
        )}
      </main>
    </div>
  )
}
