// Simple data storage using localStorage
class FitnessApp {
    constructor() {
        this.currentUser = null;
        this.exercises = [
            {
                id: '1',
                name: 'Bench Press (Barbell)',
                category: 'Barbell Lifts',
                primaryMuscle: 'Chest',
                instructions: '1. Lie flat on bench with feet planted\n2. Grip bar slightly wider than shoulder-width\n3. Lower bar to chest with control\n4. Press bar back to starting position',
                equipment: 'Barbell, Bench',
                isCompound: true
            },
            {
                id: '2',
                name: 'Deadlift (Barbell)',
                category: 'Barbell Lifts',
                primaryMuscle: 'Back',
                instructions: '1. Stand with feet hip-width apart\n2. Bend at hips and knees to grip bar\n3. Keep back straight and chest up\n4. Lift bar by extending hips and knees',
                equipment: 'Barbell',
                isCompound: true
            },
            {
                id: '3',
                name: 'Squat (Barbell)',
                category: 'Barbell Lifts',
                primaryMuscle: 'Quadriceps',
                instructions: '1. Position bar on upper back\n2. Keep chest up and back straight\n3. Descend until thighs parallel to floor\n4. Drive through heels to return to start',
                equipment: 'Barbell',
                isCompound: true
            },
            {
                id: '4',
                name: 'Overhead Press (Barbell)',
                category: 'Barbell Lifts',
                primaryMuscle: 'Shoulders',
                instructions: '1. Hold bar at shoulder height\n2. Keep core tight and back straight\n3. Press bar overhead until arms extended\n4. Lower with control to starting position',
                equipment: 'Barbell',
                isCompound: true
            },
            {
                id: '5',
                name: 'Bent Over Row (Barbell)',
                category: 'Barbell Lifts',
                primaryMuscle: 'Back',
                instructions: '1. Bend at hips with slight knee bend\n2. Grip bar shoulder-width apart\n3. Pull bar to lower chest\n4. Lower bar with control',
                equipment: 'Barbell',
                isCompound: true
            },
            {
                id: '6',
                name: 'Incline Dumbbell Press',
                category: 'Dumbbell Work',
                primaryMuscle: 'Upper Chest',
                instructions: '1. Set bench to 30-45 degree incline\n2. Press dumbbells upward\n3. Lower with control to chest level',
                equipment: 'Dumbbells, Bench',
                isCompound: true
            }
        ];
        this.init();
    }

    init() {
        // Load user data from localStorage
        const savedUser = localStorage.getItem('fitnessApp_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    saveUser(userData) {
        this.currentUser = {
            ...userData,
            joinedDate: new Date().toISOString(),
            id: '1'
        };
        localStorage.setItem('fitnessApp_user', JSON.stringify(this.currentUser));
    }

    getExercisesByCategory(category) {
        return this.exercises.filter(exercise => exercise.category === category);
    }

    searchExercises(query) {
        if (!query) return this.exercises;
        return this.exercises.filter(exercise => 
            exercise.name.toLowerCase().includes(query.toLowerCase()) ||
            exercise.primaryMuscle.toLowerCase().includes(query.toLowerCase())
        );
    }

    logWorkout(workoutData) {
        const workouts = this.getWorkouts();
        workouts.push({
            ...workoutData,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('fitnessApp_workouts', JSON.stringify(workouts));
    }

    getWorkouts() {
        const workouts = localStorage.getItem('fitnessApp_workouts');
        return workouts ? JSON.parse(workouts) : [];
    }

    getTodaysWorkout() {
        const workouts = this.getWorkouts();
        const today = this.getCurrentHKDate().toDateString();
        return workouts.find(workout => 
            new Date(workout.timestamp).toDateString() === today
        );
    }

    calculateProgress() {
        if (!this.currentUser) return null;

        const workouts = this.getWorkouts();
        const recentWorkouts = workouts.slice(-10);
        
        const efficiency = Math.min(recentWorkouts.length / 10, 1);
        const monthlyGain = 0.1 + (efficiency * 0.15);
        
        return {
            estimatedGain: monthlyGain.toFixed(2),
            workoutsThisMonth: recentWorkouts.length,
            efficiency: Math.round(efficiency * 100)
        };
    }

    // Hong Kong time functions
    getCurrentHKTime() {
        const now = new Date();
        const hkOffset = 8 * 60;
        const localOffset = now.getTimezoneOffset();
        const hkTime = new Date(now.getTime() + (localOffset + hkOffset) * 60000);
        return hkTime;
    }

    getCurrentHKDate() {
        return this.getCurrentHKTime();
    }

    formatHKDate() {
        const hkDate = this.getCurrentHKDate();
        return hkDate.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        });
    }

    formatHKTime() {
        const hkTime = this.getCurrentHKTime();
        return hkTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    getHKGreeting() {
        const hkTime = this.getCurrentHKTime();
        const hour = hkTime.getHours();
        
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        if (hour < 21) return 'Good Evening';
        return 'Good Night';
    }
}

// Initialize the app
const app = new FitnessApp();

// Navigation functions
function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}

// Date and Time Display
function updateDateTime() {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    
    if (dateElement) {
        dateElement.textContent = app.formatHKDate();
    }
    
    if (timeElement) {
        timeElement.textContent = app.formatHKTime();
    }
}

// Update time every second
function startClock() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Profile Setup Functions
function setupProfile() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const userData = {
            title: formData.get('title'),
            displayName: formData.get('displayName'),
            weight: parseFloat(formData.get('weight')),
            height: parseFloat(formData.get('height')),
            age: parseInt(formData.get('age')),
            bodyFatPercentage: parseFloat(formData.get('bodyFat')),
            activityLevel: formData.get('activityLevel'),
            goal: formData.get('goal')
        };

        app.saveUser(userData);
        navigateTo('dashboard.html');
    });
}

// Dashboard Functions
function loadDashboard() {
    if (!app.currentUser) {
        navigateTo('welcome.html');
        return;
    }

    // Start the clock
    startClock();

    // Update greeting
    const greeting = document.getElementById('greeting');
    
    if (greeting) {
        const hkGreeting = app.getHKGreeting();
        greeting.textContent = `${hkGreeting}, ${app.currentUser.title} ${app.currentUser.displayName}`;
    }

    // Load today's workout
    loadTodaysWorkout();
    
    // Load progress
    loadProgress();
}

function loadTodaysWorkout() {
    const container = document.getElementById('todaysWorkout');
    if (!container) return;

    const todaysWorkout = app.getTodaysWorkout();
    
    if (todaysWorkout) {
        container.innerHTML = `
            <div class="card">
                <h3 class="card-title">Today's Session</h3>
                <p><strong>${todaysWorkout.name || 'Workout'}</strong></p>
                <p>${todaysWorkout.exercises?.length || 0} exercises completed</p>
                <p class="workout-time">${new Date(todaysWorkout.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                })}</p>
                <button class="btn-secondary mt-4" onclick="navigateTo('log.html')">
                    View Details
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="card text-center">
                <h3 class="card-title">Today's Regimen</h3>
                <p>No session recorded for today</p>
                <p class="current-date">${app.formatHKDate()}</p>
                <button class="btn-primary mt-4" onclick="navigateTo('log.html')">
                    + Log Exercise
                </button>
            </div>
        `;
    }
}

function loadProgress() {
    const container = document.getElementById('progressOverview');
    if (!container) return;

    const progress = app.calculateProgress();
    
    if (progress) {
        container.innerHTML = `
            <div class="card">
                <h3 class="card-title">Progress Overview</h3>
                <p><strong>Estimated Monthly Gain:</strong> +${progress.estimatedGain}kg lean mass</p>
                <p><strong>Workouts This Month:</strong> ${progress.workoutsThisMonth}</p>
                <p><strong>Training Efficiency:</strong> ${progress.efficiency}%</p>
                <div class="progress-bar" style="background: #eee; height: 8px; border-radius: 4px; margin-top: 8px;">
                    <div style="background: var(--gold); height: 100%; width: ${progress.efficiency}%; border-radius: 4px;"></div>
                </div>
                <p class="last-updated" style="margin-top: 12px; font-size: 12px; color: var(--charcoal-grey); opacity: 0.7;">
                    Updated: ${app.formatHKTime()}
                </p>
            </div>
        `;
    }
}

// Exercise Library Functions
function loadExerciseLibrary() {
    const container = document.getElementById('exerciseLibrary');
    if (!container) return;

    const categories = [...new Set(app.exercises.map(ex => ex.category))];
    
    let html = '';
    categories.forEach(category => {
        const categoryExercises = app.getExercisesByCategory(category);
        html += `
            <div class="category-section">
                <h3>${category}</h3>
                <div class="exercise-grid">
                    ${categoryExercises.map(exercise => `
                        <div class="exercise-card" onclick="viewExercise('${exercise.id}')">
                            <div class="exercise-name">${exercise.name}</div>
                            <div class="exercise-muscle">${exercise.primaryMuscle}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function viewExercise(exerciseId) {
    const exercise = app.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
        alert(`${exercise.name}\n\nPrimary Muscle: ${exercise.primaryMuscle}\n\nInstructions:\n${exercise.instructions}`);
    }
}

// Profile Functions
function loadProfile() {
    const container = document.getElementById('profileInfo');
    if (!container || !app.currentUser) return;

    container.innerHTML = `
        <div class="card">
            <h3 class="card-title">Personal Information</h3>
            <p><strong>Name:</strong> ${app.currentUser.title} ${app.currentUser.displayName}</p>
            <p><strong>Weight:</strong> ${app.currentUser.weight} kg</p>
            <p><strong>Height:</strong> ${app.currentUser.height} cm</p>
            <p><strong>Age:</strong> ${app.currentUser.age}</p>
            <p><strong>Body Fat:</strong> ${app.currentUser.bodyFatPercentage}%</p>
            <p><strong>Goal:</strong> ${app.currentUser.goal}</p>
        </div>
    `;

    // Load stats
    const workouts = app.getWorkouts();
    const joinDate = new Date(app.currentUser.joinedDate).toLocaleDateString();
    
    document.getElementById('joinDate').textContent = joinDate;
    document.getElementById('totalWorkouts').textContent = workouts.length;
    
    const thisMonth = workouts.filter(w => {
        const workoutDate = new Date(w.timestamp);
        const now = new Date();
        return workoutDate.getMonth() === now.getMonth() && workoutDate.getFullYear() === now.getFullYear();
    }).length;
    
    document.getElementById('monthlyWorkouts').textContent = thisMonth;
}

function resetApp() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        localStorage.removeItem('fitnessApp_user');
        localStorage.removeItem('fitnessApp_workouts');
        navigateTo('index.html');
    }
}

// Initialize pages when they load
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'welcome.html':
            setupProfile();
            break;
        case 'dashboard.html':
            loadDashboard();
            break;
        case 'library.html':
            loadExerciseLibrary();
            break;
        case 'profile.html':
            loadProfile();
            break;
    }
});