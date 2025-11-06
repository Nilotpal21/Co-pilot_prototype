# HITL (Human-in-the-Loop) Inbox - Technical Specification

## Document Information
- **Version:** 1.0
- **Last Updated:** November 6, 2025
- **Status:** Implementation Complete
- **Author:** Development Team

---

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Models](#data-models)
6. [Feature Specifications](#feature-specifications)
7. [UI/UX Design](#uiux-design)
8. [State Management](#state-management)
9. [API Integration Points](#api-integration-points)
10. [Performance Considerations](#performance-considerations)
11. [Security Considerations](#security-considerations)
12. [Future Enhancements](#future-enhancements)

---

## 1. Overview

### 1.1 Purpose
The HITL Inbox is a task management and approval system designed for AI-powered workflow processes that require human oversight and decision-making. It provides a centralized interface for users to review, approve, or reject automated workflow outputs.

### 1.2 Key Objectives
- Provide intuitive task review and approval interface
- Support both individual and group task management
- Enable inline editing of AI-generated outputs
- Track workflow progress with detailed step-by-step visibility
- Support risk assessment and compliance review

### 1.3 Use Cases
- **Financial Approvals:** Budget reviews, transaction approvals
- **Document Verification:** KYC processes, identity verification
- **Risk Assessment:** Fraud detection, compliance checks
- **Workflow Orchestration:** Multi-step automated processes requiring human checkpoints

---

## 2. System Architecture

### 2.1 High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Personal  │  │    Group    │  │   Detail/Review     │ │
│  │    Inbox    │  │   Inbox     │  │       Panel         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Application State Layer                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        React State Management (useState, useMemo)     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer (Future)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   REST   │  │ WebSocket│  │  GraphQL │  │   Cache  │   │
│  │   API    │  │(Real-time│  │   API    │  │  Layer   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy
```
HITLInbox (Root Component)
├── TopNavigationHeader
│   ├── Logo
│   ├── NavigationMenu
│   └── UserProfile
├── InboxContent (Conditional Rendering)
│   ├── PersonalInboxView
│   │   ├── InboxSidebar
│   │   │   ├── TabGxroup (Personal/Group)
│   │   │   ├── SearchBox
│   │   │   └── TaskList
│   │   │       └── TaskItem[]
│   │   └── InboxDetail
│   │       ├── DetailHeader
│   │       ├── DetailTabs (Task/Details)
│   │       └── DetailContent
│   │           ├── TaskCard
│   │           ├── WorkflowSteps[]
│   │           ├── RiskScoringSection
│   │           ├── ApprovalDecisionSection
│   │           ├── ReasoningSection
│   │           └── ActionButtons
│   └── GroupInboxView
│       ├── GroupInboxHeader
│       │   ├── TabGroup
│       │   ├── FilterButton
│       │   └── SearchBox
│       └── GroupTableContainer
│           └── GroupInboxTable
└── AttachmentModal (Conditional)
```

---

## 3. Technology Stack

### 3.1 Frontend Framework
- **React 18+**: Component-based UI library
- **JavaScript (ES6+)**: Core programming language
- **CSS3**: Styling with custom properties

### 3.2 Development Tools
- **Create React App**: Project scaffolding
- **NPM**: Package management
- **Git**: Version control

### 3.3 Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 4. Component Architecture

### 4.1 Main Component: HITLInbox

**File:** `src/HITLInbox.js`

**Responsibilities:**
- Root component managing all application state
- Orchestrates data flow between sub-components
- Handles user interactions and state updates
- Manages conditional rendering between Personal and Group views

**State Variables:**
```javascript
{
  tasks: Array<Task>,                    // All tasks
  selectedTask: Task | null,              // Currently selected task
  searchQuery: string,                    // Search filter
  activeTab: 'personal' | 'group',        // Current view
  activeDetailTab: 'task' | 'details',    // Detail panel tab
  comment: string,                        // User comment/reasoning
  expandedSteps: Array<number>,           // Expanded workflow steps
  showAttachmentModal: boolean,           // Modal visibility
  isApprovalSectionExpanded: boolean,     // Approval section state
  approvalData: Object,                   // Approval decision data
  editingField: string | null,            // Currently editing field
  isRiskScoringExpanded: boolean,         // Risk section state
  riskScoringData: Object,                // Risk scoring data
  editingRiskField: string | null         // Risk field being edited
}
```

### 4.2 Sub-Components

#### 4.2.1 TopNavigationHeader
- Global navigation bar
- User profile dropdown
- App launcher integration

#### 4.2.2 InboxSidebar (Personal View)
- Task list with search
- Tab switching (Personal/Group)
- Task selection and highlighting

#### 4.2.3 InboxDetail (Personal View)
- Task information display
- Workflow progress visualization
- Approval/rejection actions

#### 4.2.4 GroupInboxView
- Table-based layout
- Multi-column data display
- Assign-to-me functionality

#### 4.2.5 AttachmentModal
- File preview
- Download functionality
- Close/dismiss actions

---

## 5. Data Models

### 5.1 Task Model
```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  submittedBy: string;
  submittedOn: string;
  receivedOn: string;
  category: 'Finance' | 'HR' | 'IT' | 'Operations';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-review';
  avatar: string;
  avatarColor: string;
  attachment: Attachment;
  summary: string;
  workflow: WorkflowStep[];
}
```

### 5.2 WorkflowStep Model
```typescript
interface WorkflowStep {
  step: number;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp: string | null;
  input: Record<string, any> | null;
  output: Record<string, any> | null;
}
```

### 5.3 Attachment Model
```typescript
interface Attachment {
  name: string;
  type: 'pdf' | 'doc' | 'image';
  size: string;
}
```

### 5.4 ApprovalDecision Model
```typescript
interface ApprovalDecision {
  verification_status: string;
  authenticity_score: number;
  discrepancies: number;
  compliance_status: string;
  risk_level: string;
  confidence_score: number;
  recommendation: string;
  reviewed_by: string;
  review_date: string;
  [key: string]: any; // Additional dynamic fields
}
```

### 5.5 RiskScoring Model
```typescript
interface RiskScoring {
  risk_score: number;
  risk_category: string;
  fraud_probability: number;
  credit_risk: string;
  market_volatility: string;
  regulatory_compliance: string;
  financial_health_score: number;
  recommendation: string;
  [key: string]: any; // Additional dynamic fields
}
```

---

## 6. Feature Specifications

### 6.1 Personal Inbox View

#### 6.1.1 Task List
- **Display:** Sidebar panel with scrollable task list
- **Features:**
  - Search functionality (title, description, submitter, category)
  - Task selection highlighting
  - Avatar display with custom colors
  - Priority badges
  - Status indicators
  - Timestamp display
  - Category labels

#### 6.1.2 Task Detail Panel
- **Tabs:** Task / Details
- **Information Display:**
  - Task metadata (submitted by, date, category, priority, status)
  - Task summary with bullet points
  - Attachment preview and download
  - Workflow progress tracker
  - Input/output data display (natural language format)

#### 6.1.3 Workflow Progress
- **Features:**
  - Step-by-step visualization
  - Status indicators (completed, in-progress, pending)
  - Expandable/collapsible steps
  - Timestamp display
  - Input/output data in human-readable format
  - Progress percentage calculation

### 6.2 Group Inbox View

#### 6.2.1 Table Layout
- **Columns:**
  1. Subject
  2. Message
  3. Recipients
  4. Workflow
  5. Status
  6. Date & Time (sortable)
  7. Action

#### 6.2.2 Features
- Row-based task display
- Horizontal scrolling for wide tables
- Status badges (Unassigned, Pending for approval)
- Assign-to-me buttons
- Filter functionality (Status filter with badge count)
- Search across all fields

### 6.3 Risk Scoring Section

#### 6.3.1 Display
- Collapsible card interface
- Orange left border for visual distinction
- Output fields display in key-value format

#### 6.3.2 Inline Editing
- Click any field to edit
- Edit icon appears on hover
- Purple border and focus state
- Auto-save on blur
- Real-time state updates

#### 6.3.3 Data Fields
```javascript
{
  risk_score: number,
  risk_category: string,
  fraud_probability: number,
  credit_risk: string,
  market_volatility: string,
  regulatory_compliance: string,
  financial_health_score: number,
  recommendation: string
}
```

### 6.4 Approval Decision Section

#### 6.4.1 Display
- Collapsible card interface
- Standard border styling
- Output fields display in key-value format

#### 6.4.2 Inline Editing
- Click any field to edit
- Edit icon appears on hover
- Purple border and focus state
- Auto-save on blur
- Real-time state updates

#### 6.4.3 Data Fields
```javascript
{
  verification_status: string,
  authenticity_score: number,
  discrepancies: number,
  compliance_status: string,
  risk_level: string,
  confidence_score: number,
  recommendation: string,
  reviewed_by: string,
  review_date: string
}
```

### 6.5 Approval Actions

#### 6.5.1 Approve Action
- Captures reasoning/comment
- Includes approval decision data
- Includes risk scoring data
- Shows confirmation alert
- (Future: API call to backend)

#### 6.5.2 Reject Action
- Captures reasoning/comment
- Shows confirmation alert
- (Future: API call to backend)

### 6.6 Attachment Handling

#### 6.6.1 Attachment Display
- Gmail-like card interface
- File icon, name, and size
- Download button
- Click to open modal

#### 6.6.2 Attachment Modal
- Full-screen overlay
- File preview (PDF icon placeholder)
- Download action
- Close button
- Click outside to dismiss

---

## 7. UI/UX Design

### 7.1 Design System

#### 7.1.1 Color Palette
```css
/* Primary Colors */
--primary-600: #5925DC;
--primary-700: #4A1FB8;

/* Neutral Colors */
--gray-25: #FCFCFD;
--gray-50: #F9FAFB;
--gray-100: #F2F4F7;
--gray-200: #EAECF0;
--gray-300: #D0D5DD;
--gray-400: #98A2B3;
--gray-500: #667085;
--gray-600: #475467;
--gray-700: #344054;
--gray-900: #101828;

/* Status Colors */
--success-500: #079455;
--warning-500: #F79009;
--error-500: #D92D20;
--blue-500: #155EEF;
--blue-600: #1849A9;
--blue-700: #175CD3;

/* Background Colors */
--white: #FFFFFF;
--background: #F9FAFB;
```

#### 7.1.2 Typography
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';

/* Font Sizes */
--text-xs: 12px;    /* Line height: 16px */
--text-sm: 14px;    /* Line height: 20px */
--text-base: 16px;  /* Line height: 24px */
--text-lg: 18px;    /* Line height: 28px */
--text-xl: 20px;    /* Line height: 30px */

/* Font Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
```

#### 7.1.3 Spacing System
```css
/* 4px base unit */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
```

#### 7.1.4 Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

### 7.2 Layout Structure

#### 7.2.1 Desktop Layout (Personal View)
```
┌─────────────────────────────────────────────────────┐
│                  Top Navigation                      │ 60px
├────────────────┬────────────────────────────────────┤
│                │                                     │
│   Task List    │        Detail Panel                │
│   (400px)      │        (Flexible)                  │
│                │                                     │
│                │                                     │
│                │                                     │
└────────────────┴────────────────────────────────────┘
```

#### 7.2.2 Desktop Layout (Group View)
```
┌─────────────────────────────────────────────────────┐
│                  Top Navigation                      │ 60px
├─────────────────────────────────────────────────────┤
│  Inbox Header (Title, Tabs, Filter, Search)         │
├─────────────────────────────────────────────────────┤
│                                                      │
│              Table (7 columns)                       │
│                                                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 7.3 Interaction Patterns

#### 7.3.1 Hover States
- Task items: Background changes to gray-50
- Buttons: Darker shade of base color
- Table rows: Background changes to gray-50

#### 7.3.2 Active States
- Selected task: Background purple-50, left border purple-600
- Active tab: Background white with shadow
- Focused inputs: Purple border with box-shadow

#### 7.3.3 Loading States
- (Future implementation)
- Skeleton screens for task list
- Shimmer effects for loading content

### 7.4 Accessibility

#### 7.4.1 Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys for list navigation
- Escape to close modals

#### 7.4.2 Screen Reader Support
- Semantic HTML elements
- ARIA labels for icons
- Alt text for images
- Focus management

#### 7.4.3 Color Contrast
- All text meets WCAG AA standards
- Interactive elements have sufficient contrast
- Status indicators use both color and icons

---

## 8. State Management

### 8.1 State Architecture

#### 8.1.1 Local Component State
```javascript
// React Hooks Used
- useState: Managing component state
- useMemo: Memoizing filtered data
- useEffect: Side effects and data initialization
```

#### 8.1.2 State Flow
```
User Action → Event Handler → State Update → Re-render → UI Update
```

### 8.2 Key State Operations

#### 8.2.1 Task Filtering
```javascript
const filteredTasks = useMemo(() => {
  return tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [tasks, searchQuery]);
```

#### 8.2.2 Workflow Step Expansion
```javascript
const toggleStep = (stepIndex) => {
  setExpandedSteps(prev => 
    prev.includes(stepIndex) 
      ? prev.filter(i => i !== stepIndex)
      : [...prev, stepIndex]
  );
};
```

#### 8.2.3 Inline Editing
```javascript
// Approval Data Editing
const handleFieldClick = (key) => {
  setEditingField(key);
};

const handleApprovalFieldChange = (key, value) => {
  setApprovalData(prev => ({
    ...prev,
    [key]: value
  }));
};

const handleFieldBlur = () => {
  setEditingField(null);
};
```

### 8.3 Data Initialization

#### 8.3.1 Approval Data Population
```javascript
React.useEffect(() => {
  if (selectedTask) {
    // Get latest completed step output
    const completedSteps = selectedTask.workflow.filter(
      step => step.status === 'completed' && step.output
    );
    const latestOutput = completedSteps.length > 0 
      ? completedSteps[completedSteps.length - 1].output 
      : {};
    
    // Merge with default values
    const approvalDecision = {
      verification_status: 'verified',
      authenticity_score: 0.98,
      // ... other defaults
      ...latestOutput
    };
    
    setApprovalData(approvalDecision);
  }
}, [selectedTask]);
```

---

## 9. API Integration Points

### 9.1 Future API Endpoints

#### 9.1.1 Task Management
```
GET    /api/tasks              - Fetch all tasks
GET    /api/tasks/:id          - Fetch single task
POST   /api/tasks/:id/approve  - Approve task
POST   /api/tasks/:id/reject   - Reject task
PATCH  /api/tasks/:id          - Update task
```

#### 9.1.2 Workflow Operations
```
GET    /api/workflows/:id              - Fetch workflow details
POST   /api/workflows/:id/steps/:step  - Update step data
```

#### 9.1.3 User Actions
```
GET    /api/users/me            - Get current user
GET    /api/users/me/tasks      - Get user's tasks
POST   /api/tasks/:id/assign    - Assign task to user
```

#### 9.1.4 Attachments
```
GET    /api/attachments/:id     - Download attachment
POST   /api/attachments         - Upload attachment
```

### 9.2 API Request Structure

#### 9.2.1 Approve Task Request
```json
{
  "taskId": "string",
  "action": "approve",
  "comment": "string",
  "approvalData": {
    "verification_status": "verified",
    "authenticity_score": 0.98,
    "discrepancies": 0,
    // ... other fields
  },
  "riskScoringData": {
    "risk_score": 78,
    "risk_category": "Medium-Low",
    // ... other fields
  },
  "timestamp": "ISO 8601 string",
  "userId": "string"
}
```

#### 9.2.2 Reject Task Request
```json
{
  "taskId": "string",
  "action": "reject",
  "comment": "string (required)",
  "timestamp": "ISO 8601 string",
  "userId": "string"
}
```

### 9.3 Real-time Updates (Future)

#### 9.3.1 WebSocket Events
```javascript
// Task status changes
ws.on('task:status:changed', (data) => {
  // Update task status in state
});

// New task assigned
ws.on('task:assigned', (data) => {
  // Add new task to list
});

// Task completed
ws.on('task:completed', (data) => {
  // Remove task from list
});
```

---

## 10. Performance Considerations

### 10.1 Optimization Techniques

#### 10.1.1 React Optimization
```javascript
// Memoization for expensive computations
const filteredTasks = useMemo(() => {
  return tasks.filter(/* filtering logic */);
}, [tasks, searchQuery]);

// Prevent unnecessary re-renders
// (Future: Use React.memo for sub-components)
```

#### 10.1.2 Data Handling
- Lazy loading for task list (Future: Virtual scrolling)
- Pagination for large datasets (Future)
- Debounced search input (Future)

#### 10.1.3 Bundle Size
- Code splitting (Future)
- Dynamic imports for modal (Future)
- Tree shaking for unused code

### 10.2 Performance Metrics

#### 10.2.1 Target Metrics
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

---

## 11. Security Considerations

### 11.1 Frontend Security

#### 11.1.1 Input Validation
- Sanitize user inputs before display
- Validate data types and formats
- Prevent XSS attacks

#### 11.1.2 Authentication (Future)
- JWT token management
- Secure token storage
- Auto-logout on token expiry

#### 11.1.3 Authorization (Future)
- Role-based access control
- Permission checking for actions
- Task assignment validation

### 11.2 Data Protection

#### 11.2.1 Sensitive Data
- Mask sensitive information
- Encrypt data in transit (HTTPS)
- Secure attachment handling

#### 11.2.2 Audit Trail (Future)
- Log all approval/rejection actions
- Track data modifications
- Record user interactions

---

## 12. Future Enhancements

### 12.1 Phase 2 Features

#### 12.1.1 Advanced Filtering
- Multi-field filters
- Saved filter presets
- Custom filter creation

#### 12.1.2 Bulk Operations
- Select multiple tasks
- Bulk approve/reject
- Bulk assignment

#### 12.1.3 Notifications
- In-app notifications
- Email notifications
- Push notifications

#### 12.1.4 Comments & Collaboration
- Comment threads on tasks
- @mentions
- Collaborative review

### 12.2 Phase 3 Features

#### 12.2.1 Analytics Dashboard
- Task completion metrics
- Average review time
- User performance stats

#### 12.2.2 Advanced Workflow
- Custom workflow definitions
- Conditional branching
- Parallel approvals

#### 12.2.3 Integration
- Third-party app integration
- API webhooks
- Export capabilities

### 12.3 Technical Debt

#### 12.3.1 Testing
- Unit tests for components
- Integration tests
- End-to-end tests

#### 12.3.2 Documentation
- API documentation
- Component documentation
- User guides

#### 12.3.3 Accessibility
- Full WCAG 2.1 AA compliance
- Screen reader testing
- Keyboard navigation improvements

---

## 13. Deployment

### 13.1 Build Process
```bash
# Development
npm start

# Production build
npm run build

# Test
npm test
```

### 13.2 Environment Variables
```env
REACT_APP_API_URL=<backend_api_url>
REACT_APP_WS_URL=<websocket_url>
REACT_APP_ENV=<development|staging|production>
```

### 13.3 Deployment Targets
- Development: Local development server
- Staging: Testing environment
- Production: Live environment

---

## 14. Monitoring & Logging

### 14.1 Error Tracking (Future)
- Error boundary implementation
- Sentry integration
- Error logging to backend

### 14.2 Analytics (Future)
- User interaction tracking
- Page view analytics
- Performance monitoring

---

## 15. Appendix

### 15.1 File Structure
```
my-react-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── HITLInbox.js        # Main component
│   ├── HITLInbox.css       # Styles
│   ├── App.js              # Root component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
└── README.md
```

### 15.2 Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}
```

### 15.3 Browser DevTools
- React Developer Tools extension recommended
- Redux DevTools (if Redux is added)

### 15.4 Code Style Guidelines
- Use functional components with hooks
- Follow Airbnb React/JSX Style Guide
- Use meaningful variable names
- Comment complex logic
- Keep components under 300 lines

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-06 | Development Team | Initial specification |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead | | | |
| QA Lead | | | |


