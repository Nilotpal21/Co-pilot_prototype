# HITL Inbox UI Implementation

## Overview
This is a complete implementation of the Human-in-the-Loop (HITL) Inbox interface based on the Figma design specifications. The UI provides a modern, professional interface for reviewing and approving tasks in an AI workflow system.

## Features Implemented

### 1. **Top Navigation Header**
- Kore.AI branding
- Navigation menu (Tools, Search AI, Models, Prompts, Data, Settings, Inbox)
- User dropdown and help button
- User avatar with initial

### 2. **Inbox Sidebar (Left Panel)**
- **Header Section**
  - "Inbox" title
  - Personal/Group tabs
- **Search Functionality**
  - Real-time search across tasks
  - Searches: title, description, submitter, category
- **Task List**
  - Avatar with colored background
  - Task title and description
  - Priority badges (high, medium, low)
  - Status badges (pending, in-review)
  - Metadata: submitter, date, category
  - Click to select task
  - Highlighted selection state

### 3. **Task Details Panel (Right Side)**
- **Header**
  - "Task details" title
  - Task/Details tabs
- **Task Information Card**
  - Title and description
  - Submitted by and date
  - Category
  - Priority badge
- **Workflow Progress Card**
  - Step-by-step workflow visualization
  - Completed/Pending status for each step
  - Timestamps for completed steps
  - Edit buttons (disabled for pending steps)
  - Expandable steps with chevron icons
  - Visual progress indicator with dots and lines
- **Review Section**
  - Optional comment textarea
  - "Description" label
  - Placeholder text
- **Action Footer**
  - Reject button (red, with X icon)
  - Approve button (blue, with checkmark icon)

## Design System

### Colors
Based on the Figma design system:

#### Primary Colors
- **Brand Blue**: `#155EEF`
- **Success Green**: `#079455`
- **Error Red**: `#F04438`
- **Warning Orange**: `#F79009`
- **Purple**: `#7A5AF8`

#### Neutral Colors
- **Gray 900**: `#101828` (Primary text)
- **Gray 700**: `#344054` (Secondary text)
- **Gray 500**: `#667085` (Tertiary text)
- **Gray 300**: `#D0D5DD` (Borders)
- **Gray 50**: `#F9FAFB` (Backgrounds)
- **White**: `#FFFFFF`

#### Status Colors
- **High Priority**: Red (`#FEF3F2` background, `#B42318` text)
- **Medium Priority**: Orange (`#FFFAEB` background, `#B54708` text)
- **Low Priority**: Green (`#ECFDF3` background, `#067647` text)
- **Pending Status**: Blue (`#EFF4FF` background, `#004EEB` text)
- **In-Review Status**: Purple (`#F4F3FF` background, `#5925DC` text)

### Typography
- **Font Family**: Inter (fallback to system fonts)
- **Heading XL**: 20px, 600 weight
- **Heading LG**: 18px, 600 weight
- **Body SM**: 14px, 400 weight
- **Body SM Medium**: 14px, 500 weight
- **Body SM Semibold**: 14px, 600 weight
- **Label XS**: 12px, 400 weight
- **Label XS Medium**: 12px, 500 weight

### Spacing
- Consistent use of 4px grid system
- Card padding: 24px
- Element gaps: 4px, 8px, 12px, 16px, 24px

### Border Radius
- Small elements: 4px
- Buttons/inputs: 8px
- Cards: 12px
- Pills/badges: 9999px (fully rounded)

## File Structure

```
my-react-app/src/
├── HITLInbox.js          # Main component with all functionality
├── HITLInbox.css         # Complete styling matching Figma design
├── App.js                # Root application component
├── index.js              # React entry point
└── index.css             # Global styles
```

## Running the Application

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the React app directory:
```bash
cd my-react-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to:
```
http://localhost:3000
```

## Mock Data

The application includes 5 sample tasks with realistic data:

1. **Budget Approval for Q1 Marketing Campaign** (High priority, Pending)
   - Finance category
   - All workflow steps completed
   - Submitted by Sarah Johnson

2. **New Employee Onboarding Process Update** (Medium priority, In-review)
   - HR category
   - 3 steps completed, 1 pending
   - Submitted by Michael Chen

3. **Server Infrastructure Upgrade** (High priority, Pending)
   - IT category
   - 2 steps completed, 2 pending
   - Submitted by Emily Rodriguez

4. **Team Building Event Proposal** (Low priority, In-review)
   - Operations category
   - All steps completed
   - Submitted by David Park

5. **Additional Onboarding Update** (Medium priority, In-review)
   - HR category
   - 2 steps completed, 2 pending
   - Submitted by Michael Chen

## Interactions

### Task Selection
- Click any task in the left sidebar to view its details
- Selected task is highlighted with blue border and background
- First task is auto-selected on load

### Search
- Type in the search box to filter tasks
- Searches across: title, description, submitter, category
- Real-time filtering

### Tabs
- **Personal/Group tabs**: Toggle between personal and group inboxes
- **Task/Details tabs**: Switch between task view and detailed view

### Workflow Steps
- Click chevron icon to expand/collapse step details
- Edit button appears for completed steps (currently disabled for pending)

### Actions
- **Approve**: Shows alert with task title and optional comment
- **Reject**: Shows alert with task title and optional comment
- Add comments in the textarea before taking action

## Responsive Design

The UI is responsive and adapts to different screen sizes:

- **Desktop (>1200px)**: Full layout with 460px sidebar
- **Tablet (992px-1200px)**: Narrower sidebar (380px)
- **Mobile (<768px)**: Stacked layout, sidebar above detail panel

## Future Enhancements

Potential improvements for production use:

1. **Backend Integration**
   - Connect to real API endpoints
   - Real-time updates via WebSockets
   - Persistent data storage

2. **Advanced Features**
   - Filtering by priority, status, category
   - Sorting options
   - Bulk actions
   - Export functionality

3. **Workflow Editing**
   - Enable editing of completed workflow steps
   - Add/remove workflow steps
   - Reorder steps

4. **Notifications**
   - Real-time notifications for new tasks
   - Due date reminders
   - Escalation alerts

5. **User Management**
   - User profiles
   - Role-based access control
   - Team assignments

6. **Analytics**
   - Task completion metrics
   - Performance dashboards
   - Approval/rejection rates

## Technical Notes

- Built with React 19.2.0
- Uses React Hooks (useState, useMemo)
- No external UI libraries (pure CSS implementation)
- Fully typed component props
- Semantic HTML structure
- Accessible SVG icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

Design based on Figma specifications from:
https://www.figma.com/design/IuXDkkw8ORGcGf4AJTVTLj/AI-for-Process

---

**Created by**: Cursor AI Assistant  
**Date**: November 5, 2025  
**Version**: 1.0.0

