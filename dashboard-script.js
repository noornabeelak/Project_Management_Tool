// WAV Task Management Dashboard - Interactive JavaScript

class TaskManagementDashboard {
    constructor() {
        this.tasks = new Map();
        this.teamMembers = new Map();
        this.assignments = new Map();
        this.calendars = new Map();
        this.socket = null;
        this.flowchartData = [];
        
        this.init();
    }

    init() {
        this.initializeData();
        this.setupEventListeners();
        this.initializeCalendars();
        this.initializeDragAndDrop();
        this.initializeFlowchart();
        this.initializeSocketConnection();
        this.loadDashboardData();
    }

    initializeData() {
        // Initialize team members
        this.teamMembers.set('alice', { id: 'alice', name: 'Alice Smith', role: 'Frontend Developer' });
        this.teamMembers.set('bob', { id: 'bob', name: 'Bob Johnson', role: 'Backend Developer' });
        this.teamMembers.set('charlie', { id: 'charlie', name: 'Charlie Davis', role: 'Full Stack Developer' });
        this.teamMembers.set('diana', { id: 'diana', name: 'Diana Wilson', role: 'DevOps Engineer' });
        this.teamMembers.set('eve', { id: 'eve', name: 'Eve Brown', role: 'UI/UX Designer' });
        this.teamMembers.set('frank', { id: 'frank', name: 'Frank Miller', role: 'Graphic Designer' });
        this.teamMembers.set('grace', { id: 'grace', name: 'Grace Lee', role: 'QA Engineer' });
        this.teamMembers.set('henry', { id: 'henry', name: 'Henry Taylor', role: 'Test Engineer' });

        // Initialize tasks
        this.tasks.set('task-1', {
            id: 'task-1',
            name: 'Implement Login System',
            description: 'Create secure authentication system with JWT tokens',
            priority: 'high',
            status: 'in-progress',
            dueDate: new Date('2024-12-20'),
            assignedTo: null,
            teamCard: 'task-1'
        });

        this.tasks.set('task-2', {
            id: 'task-2',
            name: 'Setup Database Schema',
            description: 'Design and implement database structure',
            priority: 'medium',
            status: 'not-started',
            dueDate: new Date('2024-12-25'),
            assignedTo: null,
            teamCard: 'task-2'
        });

        this.tasks.set('task-3', {
            id: 'task-3',
            name: 'Design User Interface',
            description: 'Create modern and responsive UI components',
            priority: 'low',
            status: 'completed',
            dueDate: new Date('2024-12-15'),
            assignedTo: 'eve',
            teamCard: 'task-3'
        });

        this.tasks.set('task-4', {
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

    setupEventListeners() {
        // View control buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.view-btn').classList.add('active');
                this.toggleView(e.target.closest('.view-btn').dataset.view);
            });
        });

        // Add task button
        document.querySelector('.add-task-btn').addEventListener('click', () => {
            this.openTaskModal();
        });

        // Calendar navigation
        document.querySelectorAll('.calendar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.calendar-btn').dataset.action;
                const calendarId = e.target.closest('.task-card').dataset.taskId;
                this.navigateCalendar(calendarId, action);
            });
        });

        // Task action buttons
        document.querySelectorAll('.action-btn.primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskCard = e.target.closest('.task-card');
                this.openTaskModal(taskCard.dataset.taskId);
            });
        });

        // Flowchart controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.control-btn').dataset.action;
                this.handleFlowchartControl(action);
            });
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeTaskModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTaskModal();
            }
        });
    }

    initializeCalendars() {
        const taskCards = ['task-1', 'task-2', 'task-3', 'task-4'];
        
        taskCards.forEach(taskId => {
            const calendarEl = document.getElementById(`calendar-${taskId.split('-')[1]}`);
            if (calendarEl) {
                const calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    height: 'auto',
                    headerToolbar: false,
                    dayMaxEvents: 2,
                    events: this.getTaskEvents(taskId),
                    eventClick: (info) => {
                        this.showEventDetails(info.event);
                    },
                    dateClick: (info) => {
                        this.handleDateClick(taskId, info.date);
                    },
                    eventDrop: (info) => {
                        this.handleEventDrop(info);
                    }
                });
                
                calendar.render();
                this.calendars.set(taskId, calendar);
            }
        });
    }

    initializeDragAndDrop() {
        // Make draggable tasks
        document.querySelectorAll('.draggable-task').forEach(task => {
            task.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', task.dataset.task);
                task.classList.add('dragging');
                this.createDragPreview(e, task);
            });

            task.addEventListener('dragend', (e) => {
                task.classList.remove('dragging');
                this.removeDragPreview();
            });
        });

        // Setup drop zones
        document.querySelectorAll('.assignment-drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const taskId = e.dataTransfer.getData('text/plain');
                const memberId = zone.dataset.member;
                const taskCard = zone.closest('.task-card').dataset.taskId;
                
                this.assignTaskToMember(taskId, memberId, taskCard);
            });
        });
    }

    initializeFlowchart() {
        this.updateFlowchart();
    }

    initializeSocketConnection() {
        // Initialize Socket.IO connection for real-time updates
        this.socket = io('http://localhost:3000');
        
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.showNotification('Connected to server', 'success');
        });

        this.socket.on('taskUpdated', (data) => {
            this.handleRemoteTaskUpdate(data);
        });

        this.socket.on('assignmentUpdated', (data) => {
            this.handleRemoteAssignmentUpdate(data);
        });

        this.socket.on('disconnect', () => {
            this.showNotification('Disconnected from server', 'warning');
        });
    }

    loadDashboardData() {
        // Load initial dashboard data
        this.updateTaskCards();
        this.updateFlowchart();
        this.syncWithServer();
    }

    // Task Management Methods
    assignTaskToMember(taskId, memberId, taskCard) {
        const task = this.tasks.get(taskId);
        if (!task) return;

        // Remove from previous assignment
        if (task.assignedTo) {
            this.removeTaskFromMember(task.assignedTo, taskId);
        }

        // Assign to new member
        task.assignedTo = memberId;
        task.teamCard = taskCard;
        
        // Update UI
        this.updateTaskAssignment(taskId, memberId, taskCard);
        this.updateFlowchart();
        
        // Sync with server
        this.syncTaskAssignment(taskId, memberId, taskCard);
        
        this.showNotification(`Task assigned to ${this.teamMembers.get(memberId).name}`, 'success');
    }

    removeTaskFromMember(memberId, taskId) {
        const dropZone = document.querySelector(`[data-member="${memberId}"] .assignment-drop-zone`);
        const assignedTask = dropZone.querySelector(`[data-task="${taskId}"]`);
        if (assignedTask) {
            assignedTask.remove();
        }
    }

    updateTaskAssignment(taskId, memberId, taskCard) {
        const task = this.tasks.get(taskId);
        const member = this.teamMembers.get(memberId);
        
        // Find the correct drop zone
        const dropZone = document.querySelector(`[data-member="${memberId}"] .assignment-drop-zone`);
        if (!dropZone) return;

        // Clear existing content
        dropZone.innerHTML = '';

        // Create assigned task element
        const assignedTask = document.createElement('div');
        assignedTask.className = 'assigned-task';
        assignedTask.dataset.task = taskId;
        assignedTask.innerHTML = `
            <span>${task.name}</span>
            <button class="remove-btn" onclick="dashboard.removeTaskAssignment('${taskId}')">
                <i class="fas fa-times"></i>
            </button>
        `;

        dropZone.appendChild(assignedTask);
    }

    removeTaskAssignment(taskId) {
        const task = this.tasks.get(taskId);
        if (!task) return;

        task.assignedTo = null;
        this.removeTaskFromMember(task.assignedTo, taskId);
        this.updateFlowchart();
        this.syncTaskAssignment(taskId, null, null);
        
        this.showNotification('Task assignment removed', 'info');
    }

    // Calendar Methods
    getTaskEvents(taskId) {
        const task = this.tasks.get(taskId);
        if (!task) return [];

        return [{
            id: taskId,
            title: task.name,
            start: task.dueDate,
            backgroundColor: this.getPriorityColor(task.priority),
            borderColor: this.getPriorityColor(task.priority),
            extendedProps: {
                task: task
            }
        }];
    }

    getPriorityColor(priority) {
        const colors = {
            'high': '#ef4444',
            'medium': '#f59e0b',
            'low': '#10b981'
        };
        return colors[priority] || '#6b7280';
    }

    navigateCalendar(calendarId, action) {
        const calendar = this.calendars.get(calendarId);
        if (!calendar) return;

        if (action === 'prev') {
            calendar.prev();
        } else if (action === 'next') {
            calendar.next();
        }

        // Update month display
        const currentDate = calendar.getDate();
        const monthElement = document.querySelector(`[data-task-id="${calendarId}"] .current-month`);
        if (monthElement) {
            monthElement.textContent = currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        }
    }

    handleDateClick(taskId, date) {
        this.openTaskModal(null, date);
    }

    handleEventDrop(info) {
        const taskId = info.event.id;
        const newDate = info.event.start;
        
        this.updateTaskDueDate(taskId, newDate);
        this.syncTaskUpdate(taskId);
    }

    updateTaskDueDate(taskId, newDate) {
        const task = this.tasks.get(taskId);
        if (task) {
            task.dueDate = newDate;
            this.showNotification(`Due date updated for ${task.name}`, 'success');
        }
    }

    // Flowchart Methods
    updateFlowchart() {
        const svg = d3.select('#flowchart-svg');
        svg.selectAll('*').remove();

        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };

        // Create flowchart data
        const nodes = this.createFlowchartNodes();
        const links = this.createFlowchartLinks();

        // Create simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Create links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);

        // Create nodes
        const node = svg.append('g')
            .selectAll('g')
            .data(nodes)
            .enter().append('g')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // Add circles for nodes
        node.append('circle')
            .attr('r', 20)
            .attr('fill', d => this.getNodeColor(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // Add labels
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', '#fff')
            .text(d => d.label);

        // Add tooltips
        node.append('title')
            .text(d => d.tooltip);

        // Update positions on simulation tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }

    createFlowchartNodes() {
        const nodes = [];
        
        // Add team member nodes
        this.teamMembers.forEach((member, id) => {
            const assignedTasks = Array.from(this.tasks.values()).filter(task => task.assignedTo === id);
            nodes.push({
                id: id,
                label: member.name.split(' ').map(n => n[0]).join(''),
                type: 'member',
                tooltip: `${member.name} (${member.role})\nAssigned tasks: ${assignedTasks.length}`,
                x: Math.random() * 600 + 100,
                y: Math.random() * 300 + 100
            });
        });

        // Add task nodes
        this.tasks.forEach((task, id) => {
            if (task.assignedTo) {
                nodes.push({
                    id: id,
                    label: task.name.split(' ').map(n => n[0]).join(''),
                    type: 'task',
                    tooltip: `${task.name}\nPriority: ${task.priority}\nStatus: ${task.status}`,
                    x: Math.random() * 600 + 100,
                    y: Math.random() * 300 + 100
                });
            }
        });

        return nodes;
    }

    createFlowchartLinks() {
        const links = [];
        
        this.tasks.forEach((task, taskId) => {
            if (task.assignedTo) {
                links.push({
                    source: task.assignedTo,
                    target: taskId,
                    type: 'assignment'
                });
            }
        });

        return links;
    }

    getNodeColor(type) {
        const colors = {
            'member': '#4f46e5',
            'task': '#10b981'
        };
        return colors[type] || '#6b7280';
    }

    // UI Methods
    toggleView(view) {
        const grid = document.querySelector('.task-cards-grid');
        if (view === 'list') {
            grid.style.gridTemplateColumns = '1fr';
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
        }
    }

    openTaskModal(taskId = null, date = null) {
        const modal = document.getElementById('task-modal');
        const form = modal.querySelector('.task-detail-form');
        
        if (taskId) {
            const task = this.tasks.get(taskId);
            if (task) {
                document.getElementById('task-name-input').value = task.name;
                document.getElementById('task-description-input').value = task.description || '';
                document.getElementById('task-priority-input').value = task.priority;
                document.getElementById('task-due-date-input').value = task.dueDate.toISOString().split('T')[0];
            }
        } else {
            form.reset();
            if (date) {
                document.getElementById('task-due-date-input').value = date.toISOString().split('T')[0];
            }
        }

        modal.style.display = 'flex';
    }

    closeTaskModal() {
        const modal = document.getElementById('task-modal');
        modal.style.display = 'none';
    }

    saveTask() {
        const name = document.getElementById('task-name-input').value;
        const description = document.getElementById('task-description-input').value;
        const priority = document.getElementById('task-priority-input').value;
        const dueDate = new Date(document.getElementById('task-due-date-input').value);

        if (!name) {
            this.showNotification('Please enter a task name', 'error');
            return;
        }

        const taskId = `task-${Date.now()}`;
        const newTask = {
            id: taskId,
            name,
            description,
            priority,
            status: 'not-started',
            dueDate,
            assignedTo: null,
            teamCard: null
        };

        this.tasks.set(taskId, newTask);
        this.addTaskToPool(newTask);
        this.updateFlowchart();
        this.syncTaskCreation(newTask);
        
        this.closeTaskModal();
        this.showNotification('Task created successfully', 'success');
    }

    addTaskToPool(task) {
        const taskPool = document.getElementById('task-pool');
        const taskElement = document.createElement('div');
        taskElement.className = 'draggable-task';
        taskElement.dataset.task = task.id;
        taskElement.draggable = true;
        
        taskElement.innerHTML = `
            <div class="task-icon">
                <i class="fas fa-tasks"></i>
            </div>
            <div class="task-details">
                <span class="task-name">${task.name}</span>
                <span class="task-priority ${task.priority}">${task.priority} Priority</span>
            </div>
        `;

        // Add drag event listeners
        taskElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            taskElement.classList.add('dragging');
        });

        taskElement.addEventListener('dragend', (e) => {
            taskElement.classList.remove('dragging');
        });

        taskPool.appendChild(taskElement);
    }

    updateTaskCards() {
        // Update task status badges
        this.tasks.forEach((task, taskId) => {
            const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskCard) {
                const statusBadge = taskCard.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.className = `status-badge ${task.status}`;
                    statusBadge.textContent = task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                }
            }
        });
    }

    // Utility Methods
    createDragPreview(event, element) {
        const preview = element.cloneNode(true);
        preview.classList.add('drag-preview');
        preview.style.position = 'fixed';
        preview.style.pointerEvents = 'none';
        preview.style.zIndex = '1000';
        preview.style.opacity = '0.8';
        preview.style.transform = 'rotate(5deg)';
        
        document.body.appendChild(preview);
        
        const updatePreview = (e) => {
            preview.style.left = e.clientX + 10 + 'px';
            preview.style.top = e.clientY + 10 + 'px';
        };
        
        document.addEventListener('dragover', updatePreview);
        
        setTimeout(() => {
            document.removeEventListener('dragover', updatePreview);
        }, 100);
    }

    removeDragPreview() {
        const preview = document.querySelector('.drag-preview');
        if (preview) {
            preview.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Server Sync Methods
    syncWithServer() {
        if (this.socket && this.socket.connected) {
            this.socket.emit('dashboardData', {
                tasks: Array.from(this.tasks.entries()),
                assignments: Array.from(this.assignments.entries())
            });
        }
    }

    syncTaskAssignment(taskId, memberId, taskCard) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('taskAssignment', {
                taskId,
                memberId,
                taskCard
            });
        }
    }

    syncTaskUpdate(taskId) {
        if (this.socket && this.socket.connected) {
            const task = this.tasks.get(taskId);
            this.socket.emit('taskUpdate', task);
        }
    }

    syncTaskCreation(task) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('taskCreated', task);
        }
    }

    handleRemoteTaskUpdate(data) {
        this.tasks.set(data.id, data);
        this.updateTaskCards();
        this.updateFlowchart();
    }

    handleRemoteAssignmentUpdate(data) {
        this.assignments.set(data.taskId, data);
        this.updateTaskAssignment(data.taskId, data.memberId, data.taskCard);
        this.updateFlowchart();
    }

    // Flowchart Controls
    handleFlowchartControl(action) {
        const svg = d3.select('#flowchart-svg');
        
        switch (action) {
            case 'zoom-in':
                // Implement zoom in
                break;
            case 'zoom-out':
                // Implement zoom out
                break;
            case 'reset':
                this.updateFlowchart();
                break;
        }
    }
}

// Global functions for HTML onclick handlers
function closeTaskModal() {
    dashboard.closeTaskModal();
}

function saveTask() {
    dashboard.saveTask();
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new TaskManagementDashboard();
});
