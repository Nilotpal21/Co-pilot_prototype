import React, { useState, useMemo } from 'react';
import './HITLInbox.css';

// Mock data generator based on Figma design
const generateMockTasks = () => {
  const priorities = ['high', 'medium', 'low'];
  const statuses = ['pending', 'in-review'];
  const categories = ['Finance', 'HR', 'IT', 'Operations'];
  
  const tasks = [
    {
      id: 1,
      title: 'Budget Approval for Q1 Marketing Campaign',
      description: 'Request for $50,000 budget allocation for the upcoming Q1 marketing campaign including digital ads and content creation.',
      submittedBy: 'Sarah Jade',
      submittedOn: 'Nov 1, 2025',
      receivedOn: 'Aug 28, 2025 12:23:08 PM',
      category: 'Finance',
      priority: 'high',
      status: 'pending',
      avatar: 'B',
      avatarColor: '#079455',
      attachment: {
        name: 'Q1_Marketing_Budget_Proposal.pdf',
        type: 'pdf',
        size: '2.4 MB'
      },
      summary: 'Verify the budget aligns with campaign goals.\nConfirm the allocation across channels.\nCheck for compliance with financial policies.\nAssess potential ROI based on projections.\nEnsure sufficient detail for each expense.\nApprove or request revisions as needed.',
      workflow: [
        { 
          step: 1, 
          name: 'Customer onboarding', 
          description: 'Application initiation and KYC trigger',
          status: 'completed', 
          timestamp: '08:00:01',
          input: {
            campaign_id: 'Q1_2025_MARKETING',
            requester: 'Sarah Jade',
            department: 'Marketing',
            submission_date: '2025-11-01'
          },
          output: {
            request_id: 'REQ-2025-001',
            status: 'initiated',
            workflow_id: 'WF-45821',
            priority: 'high'
          }
        },
        { 
          step: 2, 
          name: 'Information collection',
          description: 'Personal details and document submission', 
          status: 'completed', 
          timestamp: '08:00:02',
          input: {
            budget_amount: 50000,
            currency: 'USD',
            duration: 'Q1 2025',
            categories: ['Digital Ads', 'Content Creation', 'Social Media']
          },
          output: {
            documents_received: 3,
            validation_status: 'complete',
            required_approvals: ['Finance Manager', 'CMO'],
            estimated_roi: '250%'
          }
        },
        { 
          step: 3, 
          name: 'Face match / Liveness check',
          description: 'Digital KYC verification process', 
          status: 'completed', 
          timestamp: '08:00:03',
          input: {
            budget_breakdown: {
              digital_ads: 25000,
              content_creation: 15000,
              social_media: 10000
            },
            target_audience: 'B2B Tech Companies',
            expected_reach: '500K impressions'
          },
          output: {
            compliance_check: 'passed',
            budget_alignment: true,
            policy_violations: 0,
            recommendation: 'approve',
            confidence_score: 0.95
          }
        },
        { 
          step: 4, 
          name: 'Data validation',
          description: 'Document verification and cross-checking', 
          status: 'completed', 
          timestamp: '08:00:04',
          input: {
            documents: ['Invoice.pdf', 'Quotation_09.pdf', 'PO_08092025.pdf'],
            verification_type: 'automated',
            check_points: ['authenticity', 'amounts', 'signatures']
          },
          output: {
            verification_status: 'verified',
            authenticity_score: 0.98,
            discrepancies: 0,
            next_step: 'risk_scoring'
          }
        },
        { 
          step: 5, 
          name: 'Risk scoring',
          description: 'Automated risk assessment and categorization', 
          status: 'in-progress', 
          timestamp: null,
          input: {
            historical_data: 'Q4_2024_performance',
            market_conditions: 'favorable',
            competitor_analysis: 'included'
          },
          output: null
        },
        { 
          step: 6, 
          name: 'Approval decision',
          description: 'Final KYC approval or rejection', 
          status: 'pending', 
          timestamp: null,
          input: null,
          output: null
        }
      ]
    },
    {
      id: 2,
      title: 'New Employee Onboarding Process Update',
      description: 'Proposed changes to streamline the onboarding process for new hires, reducing time from 5 days to 3 days.',
      submittedBy: 'Mike Chen',
      submittedOn: 'Oct 30, 2025',
      receivedOn: 'Oct 30, 2025 10:15:00 AM',
      category: 'HR',
      priority: 'medium',
      status: 'in-review',
      avatar: 'N',
      avatarColor: '#F79009',
      attachment: null,
      summary: 'Review the proposed changes to the employee onboarding process and assess the impact on HR operations and new hire experience.',
      workflow: [
        { step: 1, name: 'Customer onboarding', description: 'Application initiation and KYC trigger', status: 'completed', timestamp: '15:30:01', input: null, output: null },
        { step: 2, name: 'Information collection', description: 'Personal details and document submission', status: 'completed', timestamp: '15:30:02', input: null, output: null },
        { step: 3, name: 'Face match / Liveness check', description: 'Digital KYC verification process', status: 'completed', timestamp: '15:30:03', input: null, output: null },
        { step: 4, name: 'Data validation', description: 'Document verification and cross-checking', status: 'in-progress', timestamp: null, input: null, output: null },
        { step: 5, name: 'Risk scoring', description: 'Automated risk assessment and categorization', status: 'pending', timestamp: null, input: null, output: null },
        { step: 6, name: 'Approval decision', description: 'Final KYC approval or rejection', status: 'pending', timestamp: null, input: null, output: null }
      ]
    },
    {
      id: 3,
      title: 'Server Infrastructure Upgrade',
      description: 'Upgrade to cloud infrastructure to improve performance and scalability for our main application.',
      submittedBy: 'Emily R',
      submittedOn: 'Oct 28, 2025',
      receivedOn: 'Oct 28, 2025 2:45:00 PM',
      category: 'IT',
      priority: 'high',
      status: 'pending',
      avatar: 'S',
      avatarColor: '#2970FF',
      attachment: null,
      summary: 'Evaluate the cloud infrastructure proposal and assess costs, security implications, and migration timeline.',
      workflow: [
        { step: 1, name: 'Customer onboarding', description: 'Application initiation and KYC trigger', status: 'completed', timestamp: '14:00:01', input: null, output: null },
        { step: 2, name: 'Information collection', description: 'Personal details and document submission', status: 'completed', timestamp: '14:00:02', input: null, output: null },
        { step: 3, name: 'Face match / Liveness check', description: 'Digital KYC verification process', status: 'pending', timestamp: null, input: null, output: null },
        { step: 4, name: 'Data validation', description: 'Document verification and cross-checking', status: 'pending', timestamp: null, input: null, output: null },
        { step: 5, name: 'Risk scoring', description: 'Automated risk assessment and categorization', status: 'pending', timestamp: null, input: null, output: null },
        { step: 6, name: 'Approval decision', description: 'Final KYC approval or rejection', status: 'pending', timestamp: null, input: null, output: null }
      ]
    },
    {
      id: 4,
      title: 'Team Building Event Proposal',
      description: 'Organize a team building event for the engineering team at Lake Tahoe for 3 days in December.',
      submittedBy: 'David Park',
      submittedOn: 'Oct 25, 2025',
      receivedOn: 'Oct 25, 2025 9:00:00 AM',
      category: 'Operations',
      priority: 'low',
      status: 'in-review',
      avatar: 'T',
      avatarColor: '#7A5AF8',
      attachment: null,
      summary: 'Review team building proposal including budget, location, activities, and team availability.',
      workflow: [
        { step: 1, name: 'Customer onboarding', description: 'Application initiation and KYC trigger', status: 'completed', timestamp: '13:00:01', input: null, output: null },
        { step: 2, name: 'Information collection', description: 'Personal details and document submission', status: 'completed', timestamp: '13:00:02', input: null, output: null },
        { step: 3, name: 'Face match / Liveness check', description: 'Digital KYC verification process', status: 'completed', timestamp: '13:00:03', input: null, output: null },
        { step: 4, name: 'Data validation', description: 'Document verification and cross-checking', status: 'completed', timestamp: '13:00:04', input: null, output: null },
        { step: 5, name: 'Risk scoring', description: 'Automated risk assessment and categorization', status: 'completed', timestamp: '13:00:05', input: null, output: null },
        { step: 6, name: 'Approval decision', description: 'Final KYC approval or rejection', status: 'completed', timestamp: '13:00:06', input: null, output: null }
      ]
    },
    {
      id: 5,
      title: 'New Employee Onboard...',
      description: 'Proposed changes to streamline the onboarding process for new hires, reducing time from 5 da...',
      submittedBy: 'Michael Chen',
      submittedOn: 'Oct 30, 2025',
      receivedOn: 'Oct 30, 2025 11:30:00 AM',
      category: 'HR',
      priority: 'medium',
      status: 'in-review',
      avatar: 'V',
      avatarColor: '#EE46BC',
      attachment: null,
      summary: 'Review the HR process optimization proposal and its impact on the organization.',
      workflow: [
        { step: 1, name: 'Customer onboarding', description: 'Application initiation and KYC trigger', status: 'completed', timestamp: '12:00:01', input: null, output: null },
        { step: 2, name: 'Information collection', description: 'Personal details and document submission', status: 'completed', timestamp: '12:00:02', input: null, output: null },
        { step: 3, name: 'Face match / Liveness check', description: 'Digital KYC verification process', status: 'in-progress', timestamp: null, input: null, output: null },
        { step: 4, name: 'Data validation', description: 'Document verification and cross-checking', status: 'pending', timestamp: null, input: null, output: null },
        { step: 5, name: 'Risk scoring', description: 'Automated risk assessment and categorization', status: 'pending', timestamp: null, input: null, output: null },
        { step: 6, name: 'Approval decision', description: 'Final KYC approval or rejection', status: 'pending', timestamp: null, input: null, output: null }
      ]
    }
  ];
  
  return tasks;
};

const HITLInbox = () => {
  const [tasks, setTasks] = useState(generateMockTasks());
  const [selectedTask, setSelectedTask] = useState(tasks[0]); // Select first task by default
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('group'); // personal or group - default to group
  const [activeDetailTab, setActiveDetailTab] = useState('details'); // task or details
  const [comment, setComment] = useState('');
  const [expandedSteps, setExpandedSteps] = useState([]);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isApprovalSectionExpanded, setIsApprovalSectionExpanded] = useState(true);
  const [approvalData, setApprovalData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [isRiskScoringExpanded, setIsRiskScoringExpanded] = useState(true);
  const [riskScoringData, setRiskScoringData] = useState({});
  const [editingRiskField, setEditingRiskField] = useState(null);

  // Filter tasks based on search
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const toggleStep = (stepIndex) => {
    setExpandedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  // Initialize approval data when task is selected
  React.useEffect(() => {
    if (selectedTask) {
      // Get the most recent completed step's output for approval review
      const completedSteps = selectedTask.workflow.filter(step => step.status === 'completed' && step.output);
      const latestOutput = completedSteps.length > 0 ? completedSteps[completedSteps.length - 1].output : {};
      
      // Add default approval decision values
      const approvalDecision = {
        verification_status: 'verified',
        authenticity_score: 0.98,
        discrepancies: 0,
        compliance_status: 'passed',
        risk_level: 'low',
        confidence_score: 0.95,
        recommendation: 'approve',
        reviewed_by: 'AI System',
        review_date: new Date().toLocaleDateString(),
        ...latestOutput
      };
      
      setApprovalData(approvalDecision);
      setEditingField(null);
      
      // Get Risk Scoring step data
      const riskScoringStep = selectedTask.workflow.find(step => step.name === 'Risk scoring');
      const riskOutput = riskScoringStep?.output || {};
      
      // Add default risk scoring values
      const riskScoringDecision = {
        risk_score: 78,
        risk_category: 'Medium-Low',
        fraud_probability: 0.12,
        credit_risk: 'Low',
        market_volatility: 'Stable',
        regulatory_compliance: 'Compliant',
        financial_health_score: 82,
        recommendation: 'Proceed with Standard Terms',
        ...riskOutput
      };
      
      setRiskScoringData(riskScoringDecision);
      setEditingRiskField(null);
    }
  }, [selectedTask]);

  // Action handlers
  const handleApprove = () => {
    if (!selectedTask) return;
    const approvalDataStr = Object.keys(approvalData).length > 0 
      ? '\n\nApproval Output:\n' + Object.entries(approvalData).map(([k, v]) => `  ${k}: ${v}`).join('\n')
      : '';
    const riskScoringStr = Object.keys(riskScoringData).length > 0 
      ? '\n\nRisk Scoring Output:\n' + Object.entries(riskScoringData).map(([k, v]) => `  ${k}: ${v}`).join('\n')
      : '';
    alert(`Task "${selectedTask.title}" approved!${comment ? '\nReasoning: ' + comment : ''}${approvalDataStr}${riskScoringStr}`);
    setComment('');
  };

  const handleReject = () => {
    if (!selectedTask) return;
    alert(`Task "${selectedTask.title}" rejected!${comment ? '\nReasoning: ' + comment : ''}`);
    setComment('');
  };

  const handleApprovalFieldChange = (key, value) => {
    setApprovalData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFieldClick = (key) => {
    setEditingField(key);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleRiskFieldChange = (key, value) => {
    setRiskScoringData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRiskFieldClick = (key) => {
    setEditingRiskField(key);
  };

  const handleRiskFieldBlur = () => {
    setEditingRiskField(null);
  };

  return (
    <div className="hitl-inbox">
      {/* Top Navigation Header */}
      <header className="top-header-nav">
        <div className="header-left">
          <div className="logo">Kore.AI</div>
          <nav className="nav-menu">
            <button className="nav-item">Tools</button>
            <button className="nav-item">Search AI</button>
            <button className="nav-item">Models</button>
            <button className="nav-item">Prompts</button>
            <button className="nav-item">Data</button>
            <button className="nav-item">Settings</button>
            <button className="nav-item active">Inbox</button>
          </nav>
        </div>
        <div className="header-right">
          <div className="user-dropdown">
            <span>Kore.ai</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.66699 6L8.00033 9.33333L11.3337 6" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <button className="help-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#344054" strokeWidth="1.5"/>
              <path d="M6 6C6 4.89543 6.89543 4 8 4C9.10457 4 10 4.89543 10 6C10 7.10457 9.10457 8 8 8V9" stroke="#344054" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="11" r="0.5" fill="#344054"/>
            </svg>
          </button>
          <div className="user-avatar">S</div>
        </div>
      </header>

      <div className="inbox-content">
        {activeTab === 'group' ? (
          /* Group Inbox Table View */
          <div className="group-inbox-wrapper">
            {/* Group Inbox Header */}
            <div className="group-inbox-header">
              <h1 className="inbox-title">Inbox</h1>
              
              <div className="group-controls-row">
                {/* Tabs */}
                <div className="tab-group">
                  <button 
                    className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal
                  </button>
                  <button 
                    className={`tab ${activeTab === 'group' ? 'active' : ''}`}
                    onClick={() => setActiveTab('group')}
                  >
                    Group
                  </button>
                </div>
                
                {/* Filter and Search */}
                <div className="group-filter-search">
                  <button className="filter-btn">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1.5 3H9" stroke="#344054" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M3 6H9" stroke="#344054" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M4.5 9H9" stroke="#344054" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <span>Status</span>
                    <div className="filter-count">1</div>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  <div className="search-box">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="#98A2B3" strokeWidth="1.4"/>
                      <path d="M11 11L14 14" stroke="#98A2B3" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Group Table */}
            <div className="group-table-container">
              <table className="group-inbox-table">
                <thead>
                  <tr>
                    <th className="table-header">
                      <div className="header-content">
                        <span>Subject</span>
                      </div>
                    </th>
                    <th className="table-header">
                      <div className="header-content">
                        <span>Message</span>
                      </div>
                    </th>
                    <th className="table-header">
                      <div className="header-content">
                        <span>Recipients</span>
                      </div>
                    </th>
                    <th className="table-header">
                      <div className="header-content">
                        <span>Workflow</span>
                      </div>
                    </th>
                    <th className="table-header">
                      <div className="header-content">
                        <span>Status</span>
                      </div>
                    </th>
                    <th className="table-header">
                      <div className="header-content">
                        <span>Date & time</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </th>
                    <th className="table-header">
                      <div className="header-content">
                        <span>Action</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <tr key={task.id} className="table-row">
                      <td className="table-cell">
                        <span className="cell-text truncate">{task.title}</span>
                      </td>
                      <td className="table-cell">
                        <span className="cell-text-secondary">{task.description}</span>
                      </td>
                      <td className="table-cell">
                        <span className="cell-text">
                          {index === filteredTasks.length - 1 ? 'Prompt Orchestration' : '..'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="cell-text">
                          {index === filteredTasks.length - 1 ? 'Prompt Orchestration' : ''}
                        </span>
                      </td>
                      <td className="table-cell">
                        {index === filteredTasks.length - 1 ? (
                          <div className="status-badge status-pending">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="5" stroke="#2E90FA" strokeWidth="1.5"/>
                              <path d="M6 3V6L8 8" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span>Pending for approval</span>
                          </div>
                        ) : (
                          <div className="status-badge status-unassigned">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M6 5.5C6.82843 5.5 7.5 4.82843 7.5 4C7.5 3.17157 6.82843 2.5 6 2.5C5.17157 2.5 4.5 3.17157 4.5 4C4.5 4.82843 5.17157 5.5 6 5.5Z" stroke="#4E5BA6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9 9.5L8.5 7.5C8.36739 6.94772 7.91304 6.5 7.35 6.5H4.65C4.08696 6.5 3.63261 6.94772 3.5 7.5L3 9.5" stroke="#4E5BA6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="9" y1="6" x2="9" y2="3" stroke="#4E5BA6" strokeWidth="1.2" strokeLinecap="round"/>
                              <line x1="7.5" y1="4.5" x2="10.5" y2="4.5" stroke="#4E5BA6" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                            <span>Unassigned</span>
                          </div>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className="cell-text">{task.receivedOn}</span>
                      </td>
                      <td className="table-cell">
                        {index === filteredTasks.length - 1 ? (
                          <div className="status-badge status-pending">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="5" stroke="#2E90FA" strokeWidth="1.5"/>
                              <path d="M6 3V6L8 8" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span>Pending for approval</span>
                          </div>
                        ) : (
                          <button className="assign-btn" onClick={() => {
                            setSelectedTask(task);
                            setActiveTab('personal');
                          }}>
                            Assign to me
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Personal Inbox - Sidebar + Detail View */
          <>
            <aside className="inbox-sidebar">
              {/* Inbox Header */}
              <div className="inbox-list-header">
                <h1 className="inbox-title">Inbox</h1>
                <div className="tab-group">
                  <button 
                    className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal
                  </button>
                  <button 
                    className={`tab ${activeTab === 'group' ? 'active' : ''}`}
                    onClick={() => setActiveTab('group')}
                  >
                    Group
                  </button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="search-container">
                <div className="search-box">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="#98A2B3" strokeWidth="1.4"/>
                    <path d="M11 11L14 14" stroke="#98A2B3" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Task List */}
              <div className="task-list">
                {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`task-item ${selectedTask?.id === task.id ? 'selected' : ''}`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="task-item-header">
                  <div 
                    className="task-avatar" 
                    style={{backgroundColor: task.avatarColor}}
                  >
                    {task.avatar}
                  </div>
                  <div className="task-item-content">
                    <div className="task-item-title-row">
                      <h3 className="task-item-title">{task.title}</h3>
                      <div className="task-badges">
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className={`status-badge status-${task.status}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <p className="task-item-description">{task.description}</p>
                    <div className="task-item-meta">
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2.67 4L5.33 2H10.67L13.33 4V10L10.67 12H5.33L2.67 10V4Z" stroke="#667085" strokeWidth="1.5"/>
                          <circle cx="8" cy="8" r="2" stroke="#667085" strokeWidth="1.5"/>
                        </svg>
                        {task.submittedBy}
                      </span>
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6.5" stroke="#667085" strokeWidth="1.5"/>
                          <path d="M8 4V8L11 11" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {task.submittedOn}
                      </span>
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 5.33L8 3L14 5.33V7.33L8 9.67L2 7.33V5.33Z" stroke="#667085" strokeWidth="1.5"/>
                          <path d="M2 9L8 11.33L14 9" stroke="#667085" strokeWidth="1.5"/>
                        </svg>
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content - Task Detail */}
        <main className="inbox-main">
          {selectedTask ? (
            <div className="task-detail-panel">
              {/* Detail Header */}
              <div className="detail-header">
                <h2 className="detail-title">Task details</h2>
                <div className="detail-tab-group">
                  <button 
                    className={`detail-tab ${activeDetailTab === 'task' ? 'active' : ''}`}
                    onClick={() => setActiveDetailTab('task')}
                  >
                    Task
                  </button>
                  <button 
                    className={`detail-tab ${activeDetailTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveDetailTab('details')}
                  >
                    Details
                  </button>
                </div>
              </div>

              {/* Detail Content */}
              <div className="detail-content">
                {activeDetailTab === 'task' ? (
                  <>
                    {/* Task Detail View */}
                    <div className="summary-card">
                      <h3 className="card-section-title">Summary</h3>
                      <ul className="summary-list">
                        {selectedTask.summary.split('\n').map((item, index) => (
                          item.trim() && <li key={index} className="summary-item">{item.trim()}</li>
                        ))}
                      </ul>
                      
                      {selectedTask.attachment && (
                        <div className="attachments-section">
                          <h4 className="attachments-title">Attachments</h4>
                          <div className="attachment-card" onClick={() => setShowAttachmentModal(true)}>
                            <div className="attachment-icon">
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="4" fill="#F2F4F7"/>
                                <path d="M12 10H16C16.5304 10 17.0391 10.2107 17.4142 10.5858C17.7893 10.9609 18 11.4696 18 12V22C18 22.5304 17.7893 23.0391 17.4142 23.4142C17.0391 23.7893 16.5304 24 16 24H12C11.4696 24 10.9609 23.7893 10.5858 23.4142C10.2107 23.0391 10 22.5304 10 22V12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 8V10" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M14 14H14.01" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M20 14L22 16L20 18" stroke="#D92D20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="attachment-info">
                              <div className="attachment-name">{selectedTask.attachment.name}</div>
                              <div className="attachment-size">{selectedTask.attachment.size}</div>
                            </div>
                            <button className="attachment-download" onClick={(e) => {
                              e.stopPropagation();
                              // Download logic here
                              console.log('Downloading:', selectedTask.attachment.name);
                            }}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 13.3333V4.16667M10 13.3333L6.66667 10M10 13.3333L13.3333 10" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3.33334 15.8333H16.6667" stroke="#475467" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="subject-section">
                      <span className="section-label">Subject</span>
                      <h3 className="section-value">{selectedTask.title}</h3>
                    </div>

                    <div className="message-section">
                      <span className="section-label">Message</span>
                      <p className="message-text">{selectedTask.description}</p>
                      <span className="received-time">Received on: {selectedTask.receivedOn}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Workflow Detail View */}
                    <div className="workflow-detail-section">
                      <div className="workflow-header">
                        <h3 className="workflow-title">Workflow progress</h3>
                        <p className="workflow-subtitle">Track the approval process through each stage</p>
                      </div>

                      <div className="workflow-steps">
                        {selectedTask.workflow.map((step, index) => (
                          <div key={index} className="workflow-step">
                            <div className="step-indicator">
                              <div className={`step-dot ${step.status}`}></div>
                              {index < selectedTask.workflow.length - 1 && (
                                <div className={`step-line ${step.status}`}></div>
                              )}
                            </div>
                            <div className="step-content-wrapper">
                              <div className={`step-card ${step.status === 'in-progress' ? 'in-progress' : ''} ${expandedSteps.includes(index) ? 'expanded' : ''}`}>
                                <div className="step-header" onClick={() => toggleStep(index)}>
                                  <div className="step-info-col">
                                    <span className="step-name">{step.name}</span>
                                    {expandedSteps.includes(index) && (
                                      <span className="step-description">{step.description}</span>
                                    )}
                                  </div>
                                  <div className="step-meta">
                                    {step.timestamp && expandedSteps.includes(index) && (
                                      <div className="step-time">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                          <circle cx="7" cy="7" r="5.83" stroke="#667085" strokeWidth="1.4"/>
                                          <path d="M7 3.5V7L9.5 9.5" stroke="#667085" strokeWidth="1.4" strokeLinecap="round"/>
                                        </svg>
                                        {step.timestamp}
                                      </div>
                                    )}
                                    <button 
                                      className="expand-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleStep(index);
                                      }}
                                    >
                                      <svg 
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 20 20" 
                                        fill="none"
                                        style={{ 
                                          transform: expandedSteps.includes(index) ? 'rotate(180deg)' : 'none',
                                          transition: 'transform 0.2s'
                                        }}
                                      >
                                        <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                
                                {expandedSteps.includes(index) && (step.input || step.output) && (
                                  <div className="step-details">
                                    {step.input && (
                                      <div className="data-block-container">
                                        <div className="data-label">Input</div>
                                        <div className="data-content">
                                          {Object.entries(step.input).map(([key, value]) => (
                                            <div key={key} className="data-row">
                                              <span className="data-key">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                                              <span className="data-value">
                                                {typeof value === 'object' && value !== null
                                                  ? Array.isArray(value)
                                                    ? value.join(', ')
                                                    : Object.entries(value).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
                                                  : String(value)}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {step.output && (
                                      <div className="data-block-container">
                                        <div className="data-label">Output</div>
                                        <div className="data-content">
                                          {Object.entries(step.output).map(([key, value]) => (
                                            <div key={key} className="data-row">
                                              <span className="data-key">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                                              <span className="data-value">
                                                {typeof value === 'object' && value !== null
                                                  ? Array.isArray(value)
                                                    ? value.join(', ')
                                                    : Object.entries(value).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
                                                  : String(value)}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Risk Scoring Section */}
                {Object.keys(riskScoringData).length > 0 && (
                  <div className="approval-decision-card risk-scoring-card">
                    <div className="approval-decision-header" onClick={() => setIsRiskScoringExpanded(!isRiskScoringExpanded)}>
                      <div className="approval-decision-title-row">
                        <h3 className="approval-decision-title">Risk Scoring</h3>
                        <span className="approval-decision-subtitle">Output for Review</span>
                      </div>
                      <button className="collapse-btn">
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 20 20" 
                          fill="none"
                          style={{ 
                            transform: isRiskScoringExpanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                          }}
                        >
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    
                    {isRiskScoringExpanded && (
                      <div className="approval-decision-content">
                        {Object.entries(riskScoringData).map(([key, value]) => (
                          <div key={key} className="approval-decision-field">
                            <label className="approval-decision-label">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            {editingRiskField === key ? (
                              <input
                                type="text"
                                className="approval-decision-input"
                                value={typeof value === 'object' && value !== null
                                  ? JSON.stringify(value)
                                  : String(value)}
                                onChange={(e) => handleRiskFieldChange(key, e.target.value)}
                                onBlur={handleRiskFieldBlur}
                                autoFocus
                              />
                            ) : (
                              <div 
                                className="approval-decision-value"
                                onClick={() => handleRiskFieldClick(key)}
                              >
                                <span className="approval-decision-value-text">
                                  {typeof value === 'object' && value !== null
                                    ? Array.isArray(value)
                                      ? value.join(', ')
                                      : Object.entries(value).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
                                    : String(value)}
                                </span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="edit-icon">
                                  <path d="M7.33333 2.66667H2.66667C2.31304 2.66667 1.97391 2.80714 1.72386 3.05719C1.47381 3.30724 1.33333 3.64638 1.33333 4V13.3333C1.33333 13.687 1.47381 14.0261 1.72386 14.2761C1.97391 14.5262 2.31304 14.6667 2.66667 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V8.66667" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12.3333 1.66665C12.5985 1.40144 12.9582 1.25244 13.3333 1.25244C13.7085 1.25244 14.0681 1.40144 14.3333 1.66665C14.5985 1.93187 14.7475 2.29158 14.7475 2.66665C14.7475 3.04173 14.5985 3.40144 14.3333 3.66665L8 9.99999L5.33333 10.6667L6 7.99999L12.3333 1.66665Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Approval Decision Section */}
                {Object.keys(approvalData).length > 0 && (
                  <div className="approval-decision-card">
                    <div className="approval-decision-header" onClick={() => setIsApprovalSectionExpanded(!isApprovalSectionExpanded)}>
                      <div className="approval-decision-title-row">
                        <h3 className="approval-decision-title">Approval Decision</h3>
                        <span className="approval-decision-subtitle">Output for Review</span>
                      </div>
                      <button className="collapse-btn">
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 20 20" 
                          fill="none"
                          style={{ 
                            transform: isApprovalSectionExpanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                          }}
                        >
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    
                    {isApprovalSectionExpanded && (
                      <div className="approval-decision-content">
                        {Object.entries(approvalData).map(([key, value]) => (
                          <div key={key} className="approval-decision-field">
                            <label className="approval-decision-label">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            {editingField === key ? (
                              <input
                                type="text"
                                className="approval-decision-input"
                                value={typeof value === 'object' && value !== null
                                  ? JSON.stringify(value)
                                  : String(value)}
                                onChange={(e) => handleApprovalFieldChange(key, e.target.value)}
                                onBlur={handleFieldBlur}
                                autoFocus
                              />
                            ) : (
                              <div 
                                className="approval-decision-value"
                                onClick={() => handleFieldClick(key)}
                              >
                                <span className="approval-decision-value-text">
                                  {typeof value === 'object' && value !== null
                                    ? Array.isArray(value)
                                      ? value.join(', ')
                                      : Object.entries(value).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
                                    : String(value)}
                                </span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="edit-icon">
                                  <path d="M7.33333 2.66667H2.66667C2.31304 2.66667 1.97391 2.80714 1.72386 3.05719C1.47381 3.30724 1.33333 3.64638 1.33333 4V13.3333C1.33333 13.687 1.47381 14.0261 1.72386 14.2761C1.97391 14.5262 2.31304 14.6667 2.66667 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V8.66667" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12.3333 1.66665C12.5985 1.40144 12.9582 1.25244 13.3333 1.25244C13.7085 1.25244 14.0681 1.40144 14.3333 1.66665C14.5985 1.93187 14.7475 2.29158 14.7475 2.66665C14.7475 3.04173 14.5985 3.40144 14.3333 3.66665L8 9.99999L5.33333 10.6667L6 7.99999L12.3333 1.66665Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reasoning Section */}
                <div className="review-card">
                  <div className="textarea-container">
                    <label className="textarea-label">Reasoning</label>
                    <textarea
                      placeholder="The user is requesting assistance with a bank transfer, which falls under the expertise of the Transaction_Manager."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="review-textarea"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="action-footer">
                <button onClick={handleReject} className="btn-deny">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  Deny
                </button>
                <button onClick={handleApprove} className="btn-approve">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Approve
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <svg width="70" height="70" viewBox="0 0 70 70" fill="none" className="no-selection-icon">
                <rect width="70" height="70" rx="8" fill="url(#gradient)" fillOpacity="0.1"/>
                <path d="M20 28L30 20H40L50 28V42L40 50H30L20 42V28Z" stroke="url(#gradient)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="70" y2="70">
                    <stop stopColor="#DCAED9"/>
                    <stop offset="1" stopColor="#9999CC"/>
                  </linearGradient>
                </defs>
              </svg>
              <h2>No task selected!</h2>
              <p>Please select one of the tasks to see the details, progress and actions.</p>
            </div>
          )}
        </main>
          </>
        )}
      </div>

      {/* Attachment Modal */}
      {showAttachmentModal && selectedTask?.attachment && (
        <div className="modal-overlay" onClick={() => setShowAttachmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <h3 className="modal-title">{selectedTask.attachment.name}</h3>
                <span className="modal-subtitle">{selectedTask.attachment.size}</span>
              </div>
              <div className="modal-header-actions">
                <button className="modal-action-btn" onClick={() => console.log('Download')}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13.3333V4.16667M10 13.3333L6.66667 10M10 13.3333L13.3333 10" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.33334 15.8333H16.6667" stroke="#475467" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <button className="modal-close-btn" onClick={() => setShowAttachmentModal(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5L15 15M15 5L5 15" stroke="#475467" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="pdf-preview">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" rx="8" fill="#F2F4F7"/>
                  <path d="M35 30H50C51.3261 30 52.5979 30.5268 53.5355 31.4645C54.4732 32.4021 55 33.6739 55 35V65C55 66.3261 54.4732 67.5979 53.5355 68.5355C52.5979 69.4732 51.3261 70 50 70H35C33.6739 70 32.4021 69.4732 31.4645 68.5355C30.5268 67.5979 30 66.3261 30 65V35C30 33.6739 30.5268 32.4021 31.4645 31.4645C32.4021 30.5268 33.6739 30 35 30Z" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M42.5 22.5V30" stroke="#667085" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M42.5 42.5H42.525" stroke="#667085" strokeWidth="2" strokeLinecap="round"/>
                  <text x="50" y="58" fontSize="12" fill="#667085" textAnchor="middle" fontFamily="system-ui">PDF</text>
                </svg>
                <p className="pdf-preview-text">Click download to save this file</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HITLInbox;

