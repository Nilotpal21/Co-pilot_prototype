# HITL Inbox - Visual Layout Guide

## 🎨 UI Layout Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Top Navigation Header                                                      │
│  ┌──────┐  ┌──────────────────────────────────────────┐  ┌──────────────┐ │
│  │Logo  │  │ Tools │ Search AI │ Models │ ... │ Inbox │  │ Kore.ai ⌄│?│S││
│  └──────┘  └──────────────────────────────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────┬────────────────────────────────────────────┐ │
│  │  Inbox Sidebar           │  Task Detail Panel                         │ │
│  │  (460px)                 │  (Flex: 1)                                 │ │
│  │                          │                                            │ │
│  │  ┌────────────────────┐  │  ┌──────────────────────────────────────┐ │ │
│  │  │ Inbox [Personal|Group]│ │  Task details [Task | Details ✓]     │ │ │
│  │  └────────────────────┘  │  └──────────────────────────────────────┘ │ │
│  │                          │                                            │ │
│  │  ┌────────────────────┐  │  ┌──────────────────────────────────────┐ │ │
│  │  │ 🔍 Search          │  │  │ Budget Approval for Q1 Marketing     │ │ │
│  │  └────────────────────┘  │  │ Request for $50,000 budget...        │ │ │
│  │                          │  │                                        │ │ │
│  │  ┌────────────────────┐  │  │ 👤 Submitted by: Sarah Johnson      │ │ │
│  │  │ ● R  Budget App... │  │  │ 📅 Submitted on: Nov 1, 2025        │ │ │
│  │  │     [high][pending]│  │  │ 🏷️  Category: Finance                │ │ │
│  │  │     Request for... │  │  │ ⭐ Priority: [high]                  │ │ │
│  │  │     👤 📅 🏷️        │  │  └──────────────────────────────────────┘ │ │
│  │  └────────────────────┘  │                                            │ │
│  │                          │  ┌──────────────────────────────────────┐ │ │
│  │  ┌────────────────────┐  │  │ Workflow progress                    │ │ │
│  │  │ ● S  Employee On...│  │  │ Track the approval process...        │ │ │
│  │  │     [med][in-rev]  │  │  │                                        │ │ │
│  │  │     Proposed...    │  │  │ ● Step 1: Intent Classification ✅   │ │ │
│  │  │     👤 📅 🏷️        │  │  │ │   [Completed] 16:00:01        ✏️ ⌄ │ │ │
│  │  └────────────────────┘  │  │ │                                      │ │ │
│  │                          │  │ ● Step 2: Order look up ✅            │ │ │
│  │  ┌────────────────────┐  │  │ │   [Completed] 16:00:02        ✏️ ⌄ │ │ │
│  │  │ ● T  Server Infra..│  │  │ │                                      │ │ │
│  │  │     [high][pending]│  │  │ ● Step 3: Policy check ✅             │ │ │
│  │  │     Upgrade to...  │  │  │ │   [Completed] 16:00:03        ✏️ ⌄ │ │ │
│  │  │     👤 📅 🏷️        │  │  │ │                                      │ │ │
│  │  └────────────────────┘  │  │ ● Step 4: Intent Classification ✅    │ │ │
│  │                          │  │     [Completed] 16:00:04        ✏️ ⌄ │ │ │
│  │  ┌────────────────────┐  │  └──────────────────────────────────────┘ │ │
│  │  │ ● U  Team Building │  │                                            │ │
│  │  │     [low][in-rev]  │  │  ┌──────────────────────────────────────┐ │ │
│  │  │     Organize...    │  │  │ Review commercial (Optional)         │ │ │
│  │  │     👤 📅 🏷️        │  │  │ Description                          │ │ │
│  │  └────────────────────┘  │  │ ┌──────────────────────────────────┐ │ │ │
│  │                          │  │ │ Add comments about this review...│ │ │ │
│  │  ┌────────────────────┐  │  │ │                                  │ │ │ │
│  │  │ ● V  Employee On...│  │  │ │                                  │ │ │ │
│  │  │     [med][in-rev]  │  │  │ └──────────────────────────────────┘ │ │ │
│  │  │     Proposed...    │  │  └──────────────────────────────────────┘ │ │
│  │  │     👤 📅 🏷️        │  │                                            │ │
│  │  └────────────────────┘  │  ┌──────────────────────────────────────┐ │ │
│  │                          │  │         [✗ Reject] [✓ Approve]        │ │ │
│  └──────────────────────────┴──└──────────────────────────────────────┘ │ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📐 Component Dimensions

### Header
- **Height**: 60px (fixed)
- **Border**: 1px solid #D0D5DD (bottom)
- **Background**: #FFFFFF

### Sidebar
- **Width**: 460px (fixed on desktop)
- **Background**: #F9FAFB
- **Border**: 1px solid #EAECF0 (right)

### Detail Panel
- **Width**: Flex 1 (fills remaining space)
- **Background**: #FFFFFF

---

## 🎨 Color-Coded Elements

### Priority Badges
```
┌──────┐  ┌────────┐  ┌─────┐
│ high │  │ medium │  │ low │
└──────┘  └────────┘  └─────┘
  🔴         🟠          🟢
  Red       Orange      Green
```

### Status Badges
```
┌─────────┐  ┌───────────┐
│ pending │  │ in-review │
└─────────┘  └───────────┘
    🔵            🟣
   Blue         Purple
```

### Workflow Steps
```
Completed:    ● ──── ● ──── ●
              🟢      🟢      🟢
              
Pending:      ○
              ⚪
```

---

## 📱 Screen Sizes

### Desktop (> 1200px)
```
┌────────────────────────────────────┐
│         Navigation Header          │
├──────────────┬────────────────────┤
│   Sidebar    │   Detail Panel     │
│   (460px)    │   (fills space)    │
│              │                    │
└──────────────┴────────────────────┘
```

### Tablet (992px - 1200px)
```
┌───────────────────────────────┐
│      Navigation Header        │
├────────────┬─────────────────┤
│  Sidebar   │  Detail Panel   │
│  (380px)   │  (fills space)  │
│            │                 │
└────────────┴─────────────────┘
```

### Mobile (< 768px)
```
┌───────────────────────┐
│   Navigation Header   │
├───────────────────────┤
│                       │
│      Sidebar          │
│   (full width)        │
│                       │
├───────────────────────┤
│                       │
│    Detail Panel       │
│   (full width)        │
│                       │
└───────────────────────┘
```

---

## 🔤 Typography Samples

### Headings
```
Inbox                          (20px / 600 weight)
Task details                   (20px / 600 weight)
Workflow progress              (18px / 600 weight)
```

### Body Text
```
Budget Approval for Q1...      (14px / 600 weight - Title)
Request for $50,000 budget...  (14px / 400 weight - Body)
Submitted by: Sarah Johnson    (14px / 500 weight - Label)
```

### Small Text
```
high                           (12px / 500 weight - Badge)
Nov 1, 2025                    (12px / 400 weight - Meta)
SUBMITTED BY                   (12px / 400 weight - Label uppercase)
```

---

## 🖱️ Interactive States

### Task Card States

**Default:**
```
┌────────────────────────────┐
│ Background: #FFFFFF        │
│ Border: 1px solid #D0D5DD  │
└────────────────────────────┘
```

**Hover:**
```
┌────────────────────────────┐
│ Background: #FFFFFF        │
│ Border: 1px solid #98A2B3  │
│ Shadow: 0 4px 12px rgba... │
└────────────────────────────┘
```

**Selected:**
```
┌────────────────────────────┐
│ Background: #EFF4FF        │
│ Border: 2px solid #155EEF  │
└────────────────────────────┘
```

### Button States

**Approve Button:**
```
Default:  [✓ Approve]  (#155EEF background)
Hover:    [✓ Approve]  (#1249C5 background)
Active:   [✓ Approve]  (scale 0.98)
```

**Reject Button:**
```
Default:  [✗ Reject]   (#F04438 background)
Hover:    [✗ Reject]   (#D92D20 background)
Active:   [✗ Reject]   (scale 0.98)
```

---

## 🎯 Icon Legend

### Navigation Icons
- **🔍** - Search
- **❓** - Help
- **⌄** - Dropdown chevron

### Task Metadata Icons
- **👤** - User (submitter)
- **📅** - Calendar (date)
- **🏷️** - Tag (category)

### Action Icons
- **✏️** - Edit
- **✓** - Approve/Complete
- **✗** - Reject/Close
- **⌄** - Expand/Collapse

### Status Icons
- **●** - Colored dot (avatar, workflow)
- **○** - Empty dot (pending workflow)

---

## 📊 Card Layouts

### Task Information Card
```
┌──────────────────────────────────────────┐
│ Title (18px semibold)                    │
│ Description (14px regular)               │
│                                          │
│ ┌──────────────┐  ┌──────────────┐      │
│ │ 👤 SUBMITTED  │  │ 📅 SUBMITTED  │      │
│ │    Sarah J    │  │    Nov 1      │      │
│ └──────────────┘  └──────────────┘      │
│                                          │
│ ┌──────────────┐  ┌──────────────┐      │
│ │ 🏷️ CATEGORY  │  │ ⭐ PRIORITY   │      │
│ │    Finance    │  │    [high]     │      │
│ └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────┘
```

### Workflow Progress Card
```
┌──────────────────────────────────────────┐
│ Workflow progress (18px semibold)        │
│ Track the approval process...            │
│                                          │
│ ● ─┐ Step 1: Intent Classification  ✅   │
│    │ [Completed] 16:00:01      ✏️  ⌄     │
│    │                                     │
│ ● ─┐ Step 2: Order look up  ✅           │
│    │ [Completed] 16:00:02      ✏️  ⌄     │
│    │                                     │
│ ● ─┐ Step 3: Policy check  ✅            │
│    │ [Completed] 16:00:03      ✏️  ⌄     │
│    │                                     │
│ ●   Step 4: Final Review  ✅             │
│     [Completed] 16:00:04      ✏️  ⌄     │
└──────────────────────────────────────────┘
```

---

## 🌈 Badge Color Reference

### Priority Badges

**High Priority:**
- Background: `#FEF3F2`
- Text: `#B42318`
- Border: `#FECDCA`

**Medium Priority:**
- Background: `#FFFAEB`
- Text: `#B54708`
- Border: `#FEDF89`

**Low Priority:**
- Background: `#ECFDF3`
- Text: `#067647`
- Border: `#ABEFC6`

### Status Badges

**Pending:**
- Background: `#EFF4FF`
- Text: `#004EEB`
- Border: `#B2CCFF`

**In-Review:**
- Background: `#F4F3FF`
- Text: `#5925DC`
- Border: `#D9D6FE`

### Workflow Status Badges

**Completed:**
- Background: `#ECFDF3`
- Text: `#067647`
- Border: `#ABEFC6`

**Pending:**
- Background: `#F9FAFB`
- Text: `#667085`
- Border: `#D0D5DD`

---

## 🎨 Avatar Colors

Each task has a unique colored avatar:

| Avatar | Color Code | Color Name |
|--------|------------|------------|
| R      | #079455    | Green      |
| S      | #F79009    | Orange     |
| T      | #2970FF    | Blue       |
| U      | #7A5AF8    | Purple     |
| V      | #EE46BC    | Pink       |

---

## 🔄 Animation & Transitions

### Timing
- **Duration**: 0.2s (all transitions)
- **Easing**: Default (ease)

### Animated Elements
1. Background colors on hover
2. Border colors on focus
3. Box shadows on hover
4. Button scale on click (0.98)
5. Chevron rotation (expand/collapse)

### Example Transitions
```css
transition: all 0.2s;
transition: background 0.2s;
transition: border-color 0.2s;
transition: transform 0.2s;
```

---

## 📏 Spacing System

### Padding Values
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px

### Gap Values
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px

### Border Radius
- **Small**: 4px (tabs, badges)
- **Medium**: 8px (inputs, buttons)
- **Large**: 12px (cards)
- **Full**: 9999px (pills, avatars)

---

## 🖼️ Visual Hierarchy

### Z-Index Layers
1. **Base Layer**: Task cards, content
2. **Elevated**: Selected task card
3. **Fixed**: Navigation header
4. **Overlay**: (not used, but available)
5. **Modal**: (not used, but available)

### Shadow Hierarchy
```css
/* Subtle */
box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.04);

/* Elevated */
box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.08),
            0px 1px 3px rgba(16, 24, 40, 0.08);

/* Hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
```

---

## 🎯 Visual Flow

### User Journey
```
1. User lands on page
   ↓
2. Sees task list in sidebar (first task auto-selected)
   ↓
3. Can search for specific tasks
   ↓
4. Clicks a task to view details
   ↓
5. Reviews workflow progress
   ↓
6. Expands steps for more info
   ↓
7. Adds optional comment
   ↓
8. Clicks Approve or Reject
   ↓
9. Action confirmed (alert)
```

### Visual Scanning Pattern
```
F-Pattern (typical web reading):

1. Top navigation (horizontal scan)
2. Sidebar task list (vertical scan)
3. Selected task title (horizontal)
4. Task details (vertical)
5. Action buttons (horizontal, bottom)
```

---

## 📸 Screen Captures (Description)

When you view the application, you'll see:

### Initial Load
- Top navigation bar with "Inbox" highlighted
- Left sidebar showing 5 tasks
- First task (Budget Approval) selected with blue highlight
- Right panel showing full task details
- Workflow with 4 completed green steps
- Blue "Approve" and red "Reject" buttons at bottom

### After Clicking Different Task
- Previous selection unhighlighted
- New task highlighted in blue
- Right panel updates instantly
- Workflow shows different completion status
- Smooth transition animation

### Using Search
- Type "HR" in search box
- Task list filters to show only HR tasks
- Other tasks hidden
- Search box shows focus state (blue border)

### Expanding Workflow Step
- Click chevron icon next to step
- Chevron rotates 180 degrees
- Step details expand below
- Smooth expansion animation

---

This visual guide helps you understand the layout, colors, and interactions of the HITL Inbox UI without needing actual screenshots!

