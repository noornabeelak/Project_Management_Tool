// WAV Task Management Dashboard - Main JavaScript

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeDragAndDrop();
    addHoverEffects();
    console.log('WAV Task Management Dashboard initialized');
}

function initializeDragAndDrop() {
    // Get all draggable task items
    const taskItems = document.querySelectorAll('.task-item');
    
    // Add drag event listeners to task items
    taskItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.task);
            e.dataTransfer.setData('text/html', this.outerHTML);
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Get all drop zones
    const dropZones = document.querySelectorAll('.task-drop-zone');
    
    // Add drop event listeners to drop zones
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function(e) {
            this.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            const memberId = this.dataset.member;
            
            // Assign task to member
            assignTaskToMember(taskId, memberId, this);
        });
    });
}

function assignTaskToMember(taskId, memberId, dropZone) {
    // Get task details
    const taskItem = document.querySelector(`[data-task="${taskId}"]`);
    if (!taskItem) return;
    
    const taskName = taskItem.querySelector('.task-name').textContent;
    const taskPriority = taskItem.querySelector('.task-priority').textContent;
    
    // Create assigned task element
    const assignedTask = document.createElement('div');
    assignedTask.className = 'assigned-task';
    assignedTask.dataset.task = taskId;
    assignedTask.innerHTML = `
        <span>${taskName}</span>
        <button class="remove-btn" onclick="removeTaskAssignment('${taskId}', '${memberId}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Clear drop zone and add assigned task
    dropZone.innerHTML = '';
    dropZone.appendChild(assignedTask);
    
    // Remove task from task list
    taskItem.remove();
    
    // Show notification
    showNotification(`Task assigned to ${getMemberName(memberId)}`, 'success');
}

function removeTaskAssignment(taskId, memberId) {
    const dropZone = document.querySelector(`[data-member="${memberId}"] .task-drop-zone`);
    const assignedTask = dropZone.querySelector(`[data-task="${taskId}"]`);
    
    if (assignedTask) {
        // Get task details from assigned task
        const taskName = assignedTask.querySelector('span').textContent;
        
        // Remove from drop zone
        assignedTask.remove();
        
        // Reset drop zone
        dropZone.innerHTML = '<span class="drop-hint">Drop tasks here</span>';
        
        // Add task back to task list
        addTaskBackToList(taskId, taskName);
        
        // Show notification
        showNotification(`Task removed from ${getMemberName(memberId)}`, 'info');
    }
}

function addTaskBackToList(taskId, taskName) {
    const taskItems = document.querySelector('.task-items');
    
    // Create new task item
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.draggable = true;
    taskItem.dataset.task = taskId;
    
    // Determine icon and priority based on task name
    const iconClass = getTaskIcon(taskName);
    const priority = getTaskPriority(taskName);
    
    taskItem.innerHTML = `
        <div class="task-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="task-details">
            <span class="task-name">${taskName}</span>
            <span class="task-priority ${priority}">${priority} Priority</span>
        </div>
    `;
    
    // Add drag event listeners
    taskItem.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', this.dataset.task);
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.classList.add('dragging');
    });
    
    taskItem.addEventListener('dragend', function() {
        this.classList.remove('dragging');
    });
    
    // Add to task list
    taskItems.appendChild(taskItem);
}

function getMemberName(memberId) {
    const memberNames = {
        'priya': 'Priya Sharma',
        'arjun': 'Arjun Kumar',
        'rajesh': 'Rajesh Singh',
        'kavya': 'Kavya Patel',
        'ananya': 'Ananya Mehta',
        'vikram': 'Vikram Joshi',
        'deepika': 'Deepika Reddy',
        'suresh': 'Suresh Nair'
    };
    return memberNames[memberId] || 'Unknown Member';
}

function getTaskIcon(taskName) {
    const iconMap = {
        'Implement Login System': 'fas fa-sign-in-alt',
        'Create UI Components': 'fas fa-palette',
        'Setup Database Schema': 'fas fa-database',
        'Create API Endpoints': 'fas fa-plug',
        'Design User Interface': 'fas fa-palette',
        'Create Wireframes': 'fas fa-drafting-compass',
        'Bug Testing': 'fas fa-bug',
        'Performance Testing': 'fas fa-tachometer-alt'
    };
    return iconMap[taskName] || 'fas fa-tasks';
}

function getTaskPriority(taskName) {
    const priorityMap = {
        'Implement Login System': 'high',
        'Create UI Components': 'medium',
        'Setup Database Schema': 'high',
        'Create API Endpoints': 'medium',
        'Design User Interface': 'low',
        'Create Wireframes': 'medium',
        'Bug Testing': 'high',
        'Performance Testing': 'medium'
    };
    return priorityMap[taskName] || 'medium';
}

function addHoverEffects() {
    // Add subtle animations to team cards
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effects to task items
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 0.5rem;
                padding: 1rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 1001;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            }
            
            .notification.success {
                border-left: 4px solid #10b981;
            }
            
            .notification.error {
                border-left: 4px solid #ef4444;
            }
            
            .notification.info {
                border-left: 4px solid #3b82f6;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Team Details Modal Functions
function openTeamDetails(teamId) {
    const teamData = getTeamData(teamId);
    const modal = document.getElementById('team-modal');
    const modalTitle = document.getElementById('modal-title');
    
    modalTitle.textContent = teamData.name;
    modal.style.display = 'flex';
    
    // Generate calendar
    generateCalendar(teamData);
    
    // Generate horizontal timeline
    generateHorizontalTimeline(teamData);
    
    // Populate modal task items and team members
    populateModalTasks(teamData);
    populateModalTeamMembers(teamData);
}

function closeTeamModal() {
    const modal = document.getElementById('team-modal');
    modal.style.display = 'none';
}

function getTeamData(teamId) {
    const teamData = {
        frontend: {
            name: 'Frontend Development',
            status: 'IN PROGRESS',
            progress: 75,
            teamMembers: ['Priya Sharma', 'Arjun Kumar'],
            timeline: [
                {
                    title: 'Completed user authentication system',
                    description: 'Implemented secure login with JWT tokens and role-based access control by Priya Sharma',
                    date: '2 days ago',
                    icon: 'fas fa-check-circle'
                },
                {
                    title: 'Deployed new dashboard features',
                    description: 'Added real-time updates and improved user interface components by Arjun Kumar',
                    date: '1 week ago',
                    icon: 'fas fa-rocket'
                },
                {
                    title: 'Fixed critical security vulnerabilities',
                    description: 'Resolved XSS and CSRF vulnerabilities in the frontend code by Priya Sharma',
                    date: '2 weeks ago',
                    icon: 'fas fa-bug'
                },
                {
                    title: 'Implemented responsive design',
                    description: 'Made the application fully responsive across all device sizes by Arjun Kumar',
                    date: '3 weeks ago',
                    icon: 'fas fa-mobile-alt'
                }
            ],
            tasks: [9, 15, 22, 28]
        },
        backend: {
            name: 'Backend API',
            status: 'NOT STARTED',
            progress: 25,
            teamMembers: ['Rajesh Singh', 'Kavya Patel'],
            timeline: [
                {
                    title: 'Database schema design completed',
                    description: 'Created comprehensive database structure with proper relationships by Rajesh Singh',
                    date: '1 week ago',
                    icon: 'fas fa-database'
                },
                {
                    title: 'API endpoints planning',
                    description: 'Designed RESTful API structure and endpoint specifications by Kavya Patel',
                    date: '2 weeks ago',
                    icon: 'fas fa-server'
                },
                {
                    title: 'Security protocols review',
                    description: 'Reviewed and updated security measures for API endpoints by Rajesh Singh',
                    date: '3 weeks ago',
                    icon: 'fas fa-shield-alt'
                }
            ],
            tasks: [12, 18, 25]
        },
        design: {
            name: 'UI/UX Design',
            status: 'COMPLETED',
            progress: 100,
            teamMembers: ['Ananya Mehta', 'Vikram Joshi'],
            timeline: [
                {
                    title: 'Design system implementation',
                    description: 'Created comprehensive design system with components and guidelines by Ananya Mehta',
                    date: '1 week ago',
                    icon: 'fas fa-palette'
                },
                {
                    title: 'Mobile responsive layouts',
                    description: 'Designed and implemented responsive layouts for all screen sizes by Vikram Joshi',
                    date: '2 weeks ago',
                    icon: 'fas fa-mobile-alt'
                },
                {
                    title: 'Color scheme finalization',
                    description: 'Finalized brand colors and accessibility-compliant color palette by Ananya Mehta',
                    date: '3 weeks ago',
                    icon: 'fas fa-paint-brush'
                },
                {
                    title: 'User flow optimization',
                    description: 'Optimized user journeys and improved overall user experience by Vikram Joshi',
                    date: '4 weeks ago',
                    icon: 'fas fa-route'
                }
            ],
            tasks: [5, 10, 17, 24, 31]
        },
        testing: {
            name: 'Testing & QA',
            status: 'IN PROGRESS',
            progress: 60,
            teamMembers: ['Deepika Reddy', 'Suresh Nair'],
            timeline: [
                {
                    title: 'Automated testing setup',
                    description: 'Implemented comprehensive automated testing suite by Deepika Reddy',
                    date: '3 days ago',
                    icon: 'fas fa-bug'
                },
                {
                    title: 'Unit test coverage analysis',
                    description: 'Achieved 85% code coverage with unit tests by Suresh Nair',
                    date: '1 week ago',
                    icon: 'fas fa-vial'
                },
                {
                    title: 'Quality assurance protocols',
                    description: 'Established QA processes and testing standards by Deepika Reddy',
                    date: '2 weeks ago',
                    icon: 'fas fa-clipboard-check'
                }
            ],
            tasks: [8, 14, 21, 27]
        }
    };
    
    return teamData[teamId] || teamData.frontend;
}

function generateCalendar(teamData) {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonth = document.querySelector('.current-month');
    
    // Set current month
    const now = new Date();
    currentMonth.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Clear existing calendar
    calendarGrid.innerHTML = '';
    
    // Generate calendar days
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = '600';
        dayHeader.style.color = '#6b7280';
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if this day has tasks
        if (teamData.tasks && teamData.tasks.includes(day)) {
            dayElement.classList.add('has-task');
        }
        
        // Check if this is today
        if (day === now.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Check if this is a weekend
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayElement.classList.add('weekend');
        }
        
        // Add click event listener
        dayElement.addEventListener('click', function() {
            if (dayElement.classList.contains('has-task')) {
                const taskNote = getTaskNoteForDate(day, teamData);
                showDateNote(day, taskNote);
            } else {
                showDateNote(day, 'No tasks scheduled for this date');
            }
        });
        
        calendarGrid.appendChild(dayElement);
    }
}

function generateHorizontalTimeline(teamData) {
    const timelineContainer = document.getElementById('horizontal-timeline');
    
    // Clear existing timeline
    timelineContainer.innerHTML = '';
    
    // Define 5 milestones for each team
    const milestones = getMilestonesForTeam(teamData);
    
    // Create timeline track
    const timelineTrack = document.createElement('div');
    timelineTrack.className = 'timeline-track';
    
    // Add timeline line
    const timelineLine = document.createElement('div');
    timelineLine.className = 'timeline-line';
    timelineTrack.appendChild(timelineLine);
    
    // Add progress line
    const progressLine = document.createElement('div');
    progressLine.className = 'timeline-progress';
    progressLine.style.width = `${teamData.progress || 75}%`;
    timelineTrack.appendChild(progressLine);
    
    // Add milestones
    milestones.forEach((milestone, index) => {
        const milestoneElement = document.createElement('div');
        milestoneElement.className = 'timeline-milestone';
        milestoneElement.onclick = () => showMilestoneDetails(milestone);
        
        milestoneElement.innerHTML = `
            <div class="milestone-icon ${milestone.status}">
                <i class="${milestone.icon}"></i>
            </div>
            <div class="milestone-label">${milestone.label}</div>
            <div class="milestone-date">${milestone.date}</div>
            <div class="milestone-tooltip">${milestone.description}</div>
        `;
        
        timelineTrack.appendChild(milestoneElement);
    });
    
    timelineContainer.appendChild(timelineTrack);
}

function getMilestonesForTeam(teamData) {
    const milestoneTemplates = {
        frontend: [
            { label: 'Start Date', date: 'Dec 1', status: 'completed', icon: 'fas fa-play', description: 'Project initiation and team setup' },
            { label: 'Planning', date: 'Dec 5', status: 'completed', icon: 'fas fa-clipboard-list', description: 'Requirements gathering and architecture planning' },
            { label: 'Development', date: 'Dec 15', status: 'current', icon: 'fas fa-code', description: 'Core development phase in progress' },
            { label: 'Testing', date: 'Dec 25', status: 'upcoming', icon: 'fas fa-bug', description: 'Quality assurance and testing phase' },
            { label: 'Completion', date: 'Dec 30', status: 'upcoming', icon: 'fas fa-check', description: 'Final delivery and deployment' }
        ],
        backend: [
            { label: 'Start Date', date: 'Dec 3', status: 'completed', icon: 'fas fa-play', description: 'Backend project initialization' },
            { label: 'Database', date: 'Dec 8', status: 'current', icon: 'fas fa-database', description: 'Database design and setup' },
            { label: 'API Design', date: 'Dec 18', status: 'upcoming', icon: 'fas fa-plug', description: 'API endpoints development' },
            { label: 'Integration', date: 'Dec 28', status: 'upcoming', icon: 'fas fa-link', description: 'System integration and testing' },
            { label: 'Deployment', date: 'Jan 2', status: 'upcoming', icon: 'fas fa-rocket', description: 'Production deployment' }
        ],
        design: [
            { label: 'Start Date', date: 'Nov 25', status: 'completed', icon: 'fas fa-play', description: 'Design project kickoff' },
            { label: 'Research', date: 'Nov 30', status: 'completed', icon: 'fas fa-search', description: 'User research and analysis' },
            { label: 'Wireframes', date: 'Dec 5', status: 'completed', icon: 'fas fa-drafting-compass', description: 'Wireframe creation completed' },
            { label: 'Prototypes', date: 'Dec 10', status: 'completed', icon: 'fas fa-palette', description: 'Interactive prototypes finished' },
            { label: 'Handoff', date: 'Dec 15', status: 'completed', icon: 'fas fa-handshake', description: 'Design handoff to development' }
        ],
        testing: [
            { label: 'Start Date', date: 'Dec 10', status: 'completed', icon: 'fas fa-play', description: 'Testing phase initiation' },
            { label: 'Test Planning', date: 'Dec 12', status: 'completed', icon: 'fas fa-clipboard-check', description: 'Test strategy and planning' },
            { label: 'Automation', date: 'Dec 18', status: 'current', icon: 'fas fa-robot', description: 'Automated testing setup' },
            { label: 'Execution', date: 'Dec 25', status: 'upcoming', icon: 'fas fa-vial', description: 'Test execution phase' },
            { label: 'Sign-off', date: 'Dec 30', status: 'upcoming', icon: 'fas fa-stamp', description: 'Quality assurance sign-off' }
        ]
    };
    
    return milestoneTemplates[teamData.name.toLowerCase().replace(/\s+/g, '').replace('&', '')] || milestoneTemplates.frontend;
}

function showMilestoneDetails(milestone) {
    showNotification(`Milestone: ${milestone.label} - ${milestone.description}`, 'info');
}

function populateModalTasks(teamData) {
    const taskItemsContainer = document.getElementById('modal-task-items');
    taskItemsContainer.innerHTML = '';
    
    // Get tasks specific to this team
    const teamTasks = getTeamTasks(teamData);
    
    teamTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.draggable = true;
        taskElement.dataset.task = task.id;
        
        taskElement.innerHTML = `
            <div class="task-icon">
                <i class="${task.icon}"></i>
            </div>
            <div class="task-details">
                <span class="task-name">${task.name}</span>
                <span class="task-priority ${task.priority}">${task.priority} Priority</span>
            </div>
        `;
        
        // Add drag event listeners
        taskElement.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.task);
            this.classList.add('dragging');
        });
        
        taskElement.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
        
        taskItemsContainer.appendChild(taskElement);
    });
}

function populateModalTeamMembers(teamData) {
    const teamMembersContainer = document.getElementById('modal-team-members');
    teamMembersContainer.innerHTML = '';
    
    teamData.teamMembers.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'member-container';
        memberElement.dataset.member = member.toLowerCase().replace(/\s+/g, '');
        
        const initials = member.split(' ').map(n => n[0]).join('');
        
        memberElement.innerHTML = `
            <div class="member-info">
                <div class="member-avatar">${initials}</div>
                <div class="member-details">
                    <span class="member-name">${member}</span>
                    <span class="member-role">Team Member</span>
                </div>
            </div>
            <div class="task-drop-zone" data-member="${member.toLowerCase().replace(/\s+/g, '')}">
                <span class="drop-hint">Drop tasks here</span>
            </div>
        `;
        
        // Add drop event listeners
        const dropZone = memberElement.querySelector('.task-drop-zone');
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            this.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            const memberId = this.dataset.member;
            
            assignTaskToMember(taskId, memberId, this);
        });
        
        teamMembersContainer.appendChild(memberElement);
    });
}

function getTeamTasks(teamData) {
    const taskTemplates = {
        frontend: [
            { id: 'login-system', name: 'Implement Login System', priority: 'high', icon: 'fas fa-sign-in-alt' },
            { id: 'ui-components', name: 'Create UI Components', priority: 'medium', icon: 'fas fa-palette' },
            { id: 'responsive-design', name: 'Responsive Design', priority: 'medium', icon: 'fas fa-mobile-alt' }
        ],
        backend: [
            { id: 'database-schema', name: 'Setup Database Schema', priority: 'high', icon: 'fas fa-database' },
            { id: 'api-endpoints', name: 'Create API Endpoints', priority: 'high', icon: 'fas fa-plug' },
            { id: 'authentication', name: 'Authentication System', priority: 'medium', icon: 'fas fa-shield-alt' }
        ],
        design: [
            { id: 'user-interface', name: 'Design User Interface', priority: 'low', icon: 'fas fa-palette' },
            { id: 'wireframes', name: 'Create Wireframes', priority: 'medium', icon: 'fas fa-drafting-compass' },
            { id: 'prototypes', name: 'Interactive Prototypes', priority: 'medium', icon: 'fas fa-mouse-pointer' }
        ],
        testing: [
            { id: 'bug-testing', name: 'Bug Testing', priority: 'high', icon: 'fas fa-bug' },
            { id: 'performance-test', name: 'Performance Testing', priority: 'medium', icon: 'fas fa-tachometer-alt' },
            { id: 'security-test', name: 'Security Testing', priority: 'high', icon: 'fas fa-lock' }
        ]
    };
    
    const teamKey = teamData.name.toLowerCase().replace(/\s+/g, '').replace('&', '');
    return taskTemplates[teamKey] || taskTemplates.frontend;
}

function assignTaskToMember(taskId, memberId, dropZone) {
    const taskName = getTaskNameById(taskId);
    const memberName = getMemberNameById(memberId);
    
    // Remove the drop hint and show assigned task
    dropZone.innerHTML = `
        <div class="assigned-task">
            <i class="fas fa-check-circle"></i>
            <span>${taskName}</span>
        </div>
    `;
    
    showNotification(`Task "${taskName}" assigned to ${memberName}`, 'success');
}

function getTaskNameById(taskId) {
    const taskNames = {
        'login-system': 'Implement Login System',
        'ui-components': 'Create UI Components',
        'responsive-design': 'Responsive Design',
        'database-schema': 'Setup Database Schema',
        'api-endpoints': 'Create API Endpoints',
        'authentication': 'Authentication System',
        'user-interface': 'Design User Interface',
        'wireframes': 'Create Wireframes',
        'prototypes': 'Interactive Prototypes',
        'bug-testing': 'Bug Testing',
        'performance-test': 'Performance Testing',
        'security-test': 'Security Testing'
    };
    return taskNames[taskId] || 'Unknown Task';
}

function getMemberNameById(memberId) {
    const memberNames = {
        'priyasharma': 'Priya Sharma',
        'arjunkumar': 'Arjun Kumar',
        'rajeshsingh': 'Rajesh Singh',
        'kavyapatel': 'Kavya Patel',
        'ananyamehta': 'Ananya Mehta',
        'vikramjoshi': 'Vikram Joshi',
        'deepikareddy': 'Deepika Reddy',
        'sureshnair': 'Suresh Nair'
    };
    return memberNames[memberId] || 'Unknown Member';
}

function getTaskNoteForDate(day, teamData) {
    const taskNotes = {
        frontend: {
            9: 'Priya completed user authentication system',
            15: 'Arjun deployed new dashboard features',
            22: 'Priya fixed critical security vulnerabilities',
            28: 'Arjun implemented responsive design'
        },
        backend: {
            12: 'Rajesh completed database schema design',
            18: 'Kavya created API endpoint specifications',
            25: 'Rajesh reviewed security protocols'
        },
        design: {
            5: 'Ananya completed design system implementation',
            10: 'Vikram finished mobile responsive layouts',
            17: 'Ananya finalized color scheme',
            24: 'Vikram optimized user flow',
            31: 'Ananya completed design handoff'
        },
        testing: {
            8: 'Deepika setup automated testing framework',
            14: 'Suresh achieved 85% test coverage',
            21: 'Deepika established QA protocols',
            27: 'Suresh completed security testing'
        }
    };
    
    const teamKey = teamData.name.toLowerCase().replace(/\s+/g, '').replace('&', '');
    return taskNotes[teamKey] && taskNotes[teamKey][day] ? taskNotes[teamKey][day] : 'Task completed on this date';
}

function showDateNote(day, note) {
    // Remove existing date note if any
    const existingNote = document.querySelector('.date-note');
    if (existingNote) {
        existingNote.remove();
    }
    
    // Create date note element
    const dateNote = document.createElement('div');
    dateNote.className = 'date-note';
    dateNote.innerHTML = `
        <div class="date-note-content">
            <div class="date-note-header">
                <span class="date-note-day">Day ${day}</span>
                <button class="date-note-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="date-note-text">${note}</div>
        </div>
    `;
    
    // Add to modal body
    const modalBody = document.querySelector('.modal-body');
    modalBody.appendChild(dateNote);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (dateNote.parentElement) {
            dateNote.remove();
        }
    }, 5000);
}

function changeMonth(direction) {
    // This function would change the calendar month
    // For now, we'll just show a notification
    showNotification(`Calendar navigation ${direction > 0 ? 'next' : 'previous'} month`, 'info');
}

// Status Update Function
function updateStatus(teamId, newStatus) {
    const teamData = getTeamData(teamId);
    teamData.status = newStatus.toUpperCase();
    
    // Update the dropdown styling based on status
    const dropdown = document.querySelector(`[data-team="${teamId}"] .status-dropdown`);
    if (dropdown) {
        dropdown.className = `status-dropdown ${newStatus}`;
    }
    
    showNotification(`Status updated to ${newStatus.toUpperCase()} for ${teamData.name}`, 'success');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeTeamModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTeamModal();
    }
});
