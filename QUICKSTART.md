# Quick Start Guide - HITL Inbox UI

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd my-react-app
npm install
```

### Step 2: Start the Development Server
```bash
npm start
```

### Step 3: View the Application
Open your browser to: **http://localhost:3000**

The application should automatically open in your default browser.

---

## 📱 What You'll See

### Main Interface

The UI is divided into three main sections:

#### 1. **Top Navigation Bar**
- Kore.AI logo on the left
- Navigation menu: Tools, Search AI, Models, Prompts, Data, Settings, **Inbox** (active)
- User menu and avatar on the right

#### 2. **Left Sidebar - Inbox List** (460px wide)
- **Header**: "Inbox" title with Personal/Group tabs
- **Search Bar**: Filter tasks in real-time
- **Task Cards**: 5 sample tasks showing:
  - Avatar with colored background
  - Task title
  - Priority badge (high/medium/low)
  - Status badge (pending/in-review)
  - Description excerpt
  - Metadata (submitter, date, category)

#### 3. **Right Panel - Task Details**
- **Header**: "Task details" with Task/Details tabs
- **Task Info Card**:
  - Full title and description
  - Submitted by, date, category, priority
- **Workflow Progress Card**:
  - 4 workflow steps with completion status
  - Green checkmarks for completed steps
  - Timestamps
  - Expandable details
- **Review Section**:
  - Optional comment textarea
- **Action Buttons**:
  - Red "Reject" button
  - Blue "Approve" button

---

## 🎯 Try These Interactions

### 1. Browse Tasks
- Click on any task in the left sidebar
- Notice the selected task highlights with a blue border
- The right panel updates with task details

### 2. Search Tasks
- Type in the search box at the top of the sidebar
- Try searching for:
  - "Budget" → finds marketing campaign task
  - "HR" → finds HR-related tasks
  - "Sarah" → finds tasks by Sarah Johnson

### 3. Toggle Tabs
- Click "Group" tab (no group tasks in demo)
- Switch between "Task" and "Details" tabs in the right panel

### 4. Expand Workflow Steps
- Click the down chevron icon next to any workflow step
- The step expands to show more details

### 5. Take Actions
- Add a comment in the "Description" textarea
- Click "Approve" or "Reject"
- An alert will show the action taken

---

## 🎨 Design Highlights

### Color-Coded Priority Badges
- 🔴 **Red**: High priority (urgent)
- 🟠 **Orange**: Medium priority
- 🟢 **Green**: Low priority

### Status Indicators
- 🔵 **Blue**: Pending review
- 🟣 **Purple**: In review

### Workflow Steps
- ✅ **Green dot**: Completed step
- ⚪ **White dot**: Pending step
- Green line connects completed steps

---

## 📊 Sample Data Overview

The demo includes 5 tasks:

| Task | Priority | Status | Steps Complete |
|------|----------|--------|---------------|
| Budget Approval Q1 Marketing | High | Pending | 4/4 ✅ |
| Employee Onboarding Update | Medium | In-review | 3/4 |
| Server Infrastructure Upgrade | High | Pending | 2/4 |
| Team Building Event | Low | In-review | 4/4 ✅ |
| Additional Onboarding Update | Medium | In-review | 2/4 |

---

## 🛠️ Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm start
```

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Cache
```bash
npm start -- --reset-cache
```

---

## 🔧 Development Commands

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (not recommended)
npm run eject
```

---

## 📱 Responsive Testing

Test the responsive design:

1. **Desktop View** (default)
   - Full sidebar and detail panel side-by-side

2. **Tablet View** (< 1200px)
   - Narrower sidebar
   - Navigation menu may be hidden

3. **Mobile View** (< 768px)
   - Stacked layout
   - Sidebar on top, details below

**To test**: Open DevTools (F12) → Toggle device toolbar → Select different screen sizes

---

## 🎯 Key Features to Explore

### ✅ Implemented Features
- [x] Full Figma design implementation
- [x] Real-time search filtering
- [x] Task selection and highlighting
- [x] Workflow progress visualization
- [x] Expandable workflow steps
- [x] Approve/Reject actions
- [x] Comment functionality
- [x] Responsive design
- [x] Custom scrollbars
- [x] SVG icons throughout
- [x] Hover states and transitions

### 🔮 Future Enhancements (Not Yet Implemented)
- [ ] Backend API integration
- [ ] Real-time updates
- [ ] Persistent storage
- [ ] User authentication
- [ ] Advanced filtering
- [ ] Bulk actions
- [ ] Export functionality
- [ ] Notifications

---

## 📞 Need Help?

### Common Questions

**Q: Where is the data coming from?**  
A: Currently using mock data in `HITLInbox.js`. In production, this would connect to a backend API.

**Q: Can I modify the tasks?**  
A: Yes! Edit the `generateMockTasks()` function in `HITLInbox.js` to add/modify tasks.

**Q: How do I change colors?**  
A: Edit the CSS variables in `HITLInbox.css`. All colors are explicitly defined.

**Q: Can I add more workflow steps?**  
A: Yes! Add more step objects to the `workflow` array in each task.

---

## 📚 Related Documentation

- [Full Implementation Guide](UI_IMPLEMENTATION.md)
- [React Documentation](https://react.dev/)
- [Original Figma Design](https://www.figma.com/design/IuXDkkw8ORGcGf4AJTVTLj/AI-for-Process)

---

**Happy Coding! 🚀**

If you encounter any issues or have questions, refer to the detailed documentation in `UI_IMPLEMENTATION.md`.

