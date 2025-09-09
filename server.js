// WAV Task Management Dashboard - Node.js Server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory data storage (in production, use a database)
const dashboardData = {
    tasks: new Map(),
    assignments: new Map(),
    teamMembers: new Map()
};

// Initialize sample data
function initializeData() {
    // Team members
    dashboardData.teamMembers.set('alice', { id: 'alice', name: 'Alice Smith', role: 'Frontend Developer' });
    dashboardData.teamMembers.set('bob', { id: 'bob', name: 'Bob Johnson', role: 'Backend Developer' });
    dashboardData.teamMembers.set('charlie', { id: 'charlie', name: 'Charlie Davis', role: 'Full Stack Developer' });
    dashboardData.teamMembers.set('diana', { id: 'diana', name: 'Diana Wilson', role: 'DevOps Engineer' });
    dashboardData.teamMembers.set('eve', { id: 'eve', name: 'Eve Brown', role: 'UI/UX Designer' });
    dashboardData.teamMembers.set('frank', { id: 'frank', name: 'Frank Miller', role: 'Graphic Designer' });
    dashboardData.teamMembers.set('grace', { id: 'grace', name: 'Grace Lee', role: 'QA Engineer' });
    dashboardData.teamMembers.set('henry', { id: 'henry', name: 'Henry Taylor', role: 'Test Engineer' });

    // Sample tasks
    dashboardData.tasks.set('task-1', {
        id: 'task-1',
        name: 'Implement Login System',
        description: 'Create secure authentication system with JWT tokens',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date('2024-12-20'),
        assignedTo: null,
        teamCard: 'task-1'
    });

    dashboardData.tasks.set('task-2', {
        id: 'task-2',
        name: 'Setup Database Schema',
        description: 'Design and implement database structure',
        priority: 'medium',
        status: 'not-started',
        dueDate: new Date('2024-12-25'),
        assignedTo: null,
        teamCard: 'task-2'
    });

    dashboardData.tasks.set('task-3', {
        id: 'task-3',
        name: 'Design User Interface',
        description: 'Create modern and responsive UI components',
        priority: 'low',
        status: 'completed',
        dueDate: new Date('2024-12-15'),
        assignedTo: 'eve',
        teamCard: 'task-3'
    });

    dashboardData.tasks.set('task-4', {
        id: 'task-4',
        name: 'Bug Testing',
        description: 'Comprehensive testing of all features',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date('2024-12-30'),
        assignedTo: 'grace',
        teamCard: 'task-4'
    });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send initial data to newly connected client
    socket.emit('initialData', {
        tasks: Array.from(dashboardData.tasks.entries()),
        assignments: Array.from(dashboardData.assignments.entries()),
        teamMembers: Array.from(dashboardData.teamMembers.entries())
    });

    // Handle dashboard data sync
    socket.on('dashboardData', (data) => {
        console.log('Dashboard data received:', data);
        // Broadcast to all other clients
        socket.broadcast.emit('dashboardDataUpdate', data);
    });

    // Handle task assignment updates
    socket.on('taskAssignment', (data) => {
        console.log('Task assignment received:', data);
        
        // Update local data
        if (data.memberId) {
            dashboardData.assignments.set(data.taskId, data);
        } else {
            dashboardData.assignments.delete(data.taskId);
        }

        // Update task data
        const task = dashboardData.tasks.get(data.taskId);
        if (task) {
            task.assignedTo = data.memberId;
            task.teamCard = data.taskCard;
        }

        // Broadcast to all clients
        io.emit('assignmentUpdated', data);
    });

    // Handle task updates
    socket.on('taskUpdate', (data) => {
        console.log('Task update received:', data);
        
        // Update local data
        dashboardData.tasks.set(data.id, data);
        
        // Broadcast to all clients
        io.emit('taskUpdated', data);
    });

    // Handle new task creation
    socket.on('taskCreated', (data) => {
        console.log('New task created:', data);
        
        // Update local data
        dashboardData.tasks.set(data.id, data);
        
        // Broadcast to all clients
        io.emit('taskCreated', data);
    });

    // Handle task status updates
    socket.on('taskStatusUpdate', (data) => {
        console.log('Task status update received:', data);
        
        const task = dashboardData.tasks.get(data.taskId);
        if (task) {
            task.status = data.status;
            io.emit('taskUpdated', task);
        }
    });

    // Handle calendar updates
    socket.on('calendarUpdate', (data) => {
        console.log('Calendar update received:', data);
        
        const task = dashboardData.tasks.get(data.taskId);
        if (task) {
            task.dueDate = new Date(data.dueDate);
            io.emit('taskUpdated', task);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// API Routes
app.get('/api/tasks', (req, res) => {
    res.json({
        tasks: Array.from(dashboardData.tasks.entries()),
        assignments: Array.from(dashboardData.assignments.entries()),
        teamMembers: Array.from(dashboardData.teamMembers.entries())
    });
});

app.post('/api/tasks', (req, res) => {
    const { name, description, priority, dueDate, teamCard } = req.body;
    const taskId = `task-${Date.now()}`;
    
    const newTask = {
        id: taskId,
        name,
        description,
        priority,
        status: 'not-started',
        dueDate: new Date(dueDate),
        assignedTo: null,
        teamCard
    };

    dashboardData.tasks.set(taskId, newTask);
    
    // Broadcast to all clients
    io.emit('taskCreated', newTask);
    
    res.json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updates = req.body;
    
    const task = dashboardData.tasks.get(taskId);
    if (task) {
        Object.assign(task, updates);
        dashboardData.tasks.set(taskId, task);
        
        // Broadcast to all clients
        io.emit('taskUpdated', task);
        
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    
    if (dashboardData.tasks.has(taskId)) {
        dashboardData.tasks.delete(taskId);
        dashboardData.assignments.delete(taskId);
        
        // Broadcast to all clients
        io.emit('taskDeleted', { taskId });
        
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.post('/api/assignments', (req, res) => {
    const { taskId, memberId, taskCard } = req.body;
    
    const assignment = { taskId, memberId, taskCard };
    dashboardData.assignments.set(taskId, assignment);
    
    // Update task data
    const task = dashboardData.tasks.get(taskId);
    if (task) {
        task.assignedTo = memberId;
        task.teamCard = taskCard;
    }
    
    // Broadcast to all clients
    io.emit('assignmentUpdated', assignment);
    
    res.json(assignment);
});

app.delete('/api/assignments/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    
    dashboardData.assignments.delete(taskId);
    
    // Update task data
    const task = dashboardData.tasks.get(taskId);
    if (task) {
        task.assignedTo = null;
        task.teamCard = null;
    }
    
    // Broadcast to all clients
    io.emit('assignmentRemoved', { taskId });
    
    res.json({ success: true });
});

// Serve the dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize data and start server
initializeData();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WAV Task Management Server running on port ${PORT}`);
    console.log(`Dashboard available at: http://localhost:${PORT}/dashboard`);
    console.log(`Main page available at: http://localhost:${PORT}/`);
});

module.exports = { app, server, io };
