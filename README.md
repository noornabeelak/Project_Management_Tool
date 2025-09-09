# WAV Task Management Dashboard

An interactive task management dashboard with draggable cards, real-time collaboration, and dynamic flowchart visualizations.

## Features

### 🎯 **Core Functionality**
- **4 Compact Task Cards** - Each representing different team tasks
- **Interactive Calendars** - Full calendar integration with date picker functionality
- **Drag & Drop Assignment** - Smooth task assignment to team members
- **Dynamic Flowchart** - Real-time visualization of task workflows
- **Real-time Synchronization** - Live updates across all connected users

### 📅 **Calendar Features**
- Full calendar integration with FullCalendar.js
- Date picker functionality for task scheduling
- Drag and drop for rescheduling tasks
- Visual indicators for task deadlines and priorities

### 🎨 **Drag & Drop System**
- Intuitive task assignment to team members
- Visual feedback during drag operations
- Reassignment capabilities
- Priority-based color coding

### 📊 **Flowchart Visualization**
- Dynamic D3.js-powered flowcharts
- Interactive nodes showing team members and tasks
- Real-time updates based on assignments
- Zoom and pan controls

### 🔄 **Real-time Features**
- Socket.IO for live synchronization
- Multi-user collaboration
- Instant updates across all clients
- Connection status indicators

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Calendar**: FullCalendar.js
- **Visualization**: D3.js
- **Real-time**: Socket.IO
- **Backend**: Node.js, Express.js
- **Styling**: Custom CSS with modern design principles

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the dashboard**
   - Main page: http://localhost:3000/
   - Dashboard: http://localhost:3000/dashboard

### Development Mode
```bash
npm run dev
```

## Usage Guide

### 🏠 **Home Page**
- View team spaces with recent accomplishments
- Click on team cards to access detailed views
- Professional, classy design with smooth animations

### 📋 **Dashboard**
- **Task Cards**: 4 compact cards for different team tasks
- **Calendar Integration**: Click dates to schedule tasks
- **Drag & Drop**: Drag tasks from the pool to team members
- **Flowchart**: Visual representation of task assignments
- **Real-time Updates**: See changes instantly across all users

### 🎯 **Task Management**
1. **Create Tasks**: Click "Create New Task" button
2. **Assign Tasks**: Drag tasks to team member drop zones
3. **Schedule Tasks**: Use calendar to set deadlines
4. **Track Progress**: Monitor status updates in real-time

### 👥 **Team Assignment**
- Drag tasks from the task pool
- Drop onto team member assignment zones
- Visual feedback during drag operations
- Automatic calendar updates

### 📊 **Flowchart Visualization**
- Interactive nodes for team members and tasks
- Drag nodes to reorganize layout
- Click nodes for detailed information
- Real-time updates based on assignments

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Assignments
- `POST /api/assignments` - Assign task to member
- `DELETE /api/assignments/:taskId` - Remove assignment

## Real-time Events

### Client to Server
- `dashboardData` - Sync dashboard data
- `taskAssignment` - Update task assignment
- `taskUpdate` - Update task details
- `taskCreated` - Create new task
- `taskStatusUpdate` - Update task status
- `calendarUpdate` - Update calendar events

### Server to Client
- `initialData` - Initial data on connection
- `taskUpdated` - Task update notification
- `assignmentUpdated` - Assignment update notification
- `taskCreated` - New task notification
- `taskDeleted` - Task deletion notification

## Customization

### Adding New Team Members
Edit the `initializeData()` function in `dashboard-script.js`:

```javascript
this.teamMembers.set('newMember', { 
    id: 'newMember', 
    name: 'New Member', 
    role: 'Role' 
});
```

### Modifying Task Cards
Update the HTML structure in `dashboard.html` and corresponding CSS in `dashboard-styles.css`.

### Customizing Flowchart
Modify the `createFlowchartNodes()` and `createFlowchartLinks()` methods in `dashboard-script.js`.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance Features

- **Optimized Rendering**: Efficient DOM updates
- **Lazy Loading**: Components load as needed
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: 60fps animations with CSS transforms

## Security Features

- **Input Validation**: All user inputs are validated
- **XSS Protection**: Sanitized HTML content
- **CORS Configuration**: Proper cross-origin setup
- **Rate Limiting**: Built-in request limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the WAV Platform**
