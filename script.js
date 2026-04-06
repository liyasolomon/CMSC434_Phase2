/* --- nav bar control --- */
function showPage(pageId) {
    document.querySelectorAll('.app-page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'flex';
    
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
        if(pageId.includes(t.innerText.toLowerCase())) t.classList.add('active');
    });
}

/* ------------------------------- GOALS PAGE ------------------------------------------ */

/* --- cycle through goals --- */
const goalsList = [
    { name: "Spring Break Fund", saved: 1200, total: 2000, pct: 60 },
    { name: "New Laptop", saved: 450, total: 1500, pct: 30 }
];
let goalIdx = 0;

function moveGoal(dir) {
    goalIdx = (goalIdx + dir + goalsList.length) % goalsList.length;
    const g = goalsList[goalIdx];
    document.getElementById('goal-name').innerText = g.name;
    document.getElementById('goal-saved').innerText = `$${g.saved}`;
    document.getElementById('goal-total').innerText = `$${g.total}`;
    document.getElementById('progress-fill').style.width = g.pct + "%";
}

/* --- adding a new goal --- */
function addNewGoal() {
    // grab values from the input fields
    const nameInput = document.getElementById('new-g-name').value;
    const targetInput = parseFloat(document.getElementById('new-g-target').value);
    const savedInput = parseFloat(document.getElementById('new-g-saved').value) || 0;
    if (!nameInput || !targetInput) {
        alert("Please enter a goal name and target amount!");
        return;
    }

    // calculate percentage for the progress bar
    const calcPct = Math.min(Math.round((savedInput / targetInput) * 100), 100);

    // create new goal object and add to array
    const newGoal = {
        name: nameInput,
        saved: savedInput,
        total: targetInput,
        pct: calcPct
    };
    goalsList.push(newGoal);

    // switch view to show newly created goal
    goalIdx = goalsList.length - 1;
    updateGoalUI();

    // clear inputs and close popup
    document.getElementById('new-g-name').value = "";
    document.getElementById('new-g-target').value = "";
    document.getElementById('new-g-saved').value = "";
    closePop();
}

/* HELPER: Separate UI updates to keep code clean */

/* --- DEEP VERTICAL TASK: ADDING A NEW GOAL --- */
function addNewGoal() {
    // 1. Grab values from the input fields
    const nameInput = document.getElementById('new-g-name').value;
    const targetInput = parseFloat(document.getElementById('new-g-target').value);
    const savedInput = parseFloat(document.getElementById('new-g-saved').value) || 0;

    // 2. Simple Validation (Make sure name and target aren't empty)
    if (!nameInput || !targetInput) {
        alert("Please enter a goal name and target amount!");
        return;
    }

    // 3. Calculate percentage for the progress bar
    const calcPct = Math.min(Math.round((savedInput / targetInput) * 100), 100);

    // 4. Create the new goal object and add it to our array
    const newGoal = {
        name: nameInput,
        saved: savedInput,
        total: targetInput,
        pct: calcPct
    };

    goalsList.push(newGoal);

    // 5. Switch view to show the newly created goal
    goalIdx = goalsList.length - 1;
    updateGoalUI();

    // 6. Clear the inputs and close the popup
    document.getElementById('new-g-name').value = "";
    document.getElementById('new-g-target').value = "";
    document.getElementById('new-g-saved').value = "";
    closePop();
}

/* HELPER: Separate UI updates to keep code clean */
function updateGoalUI() {
    const g = goalsList[goalIdx];
    document.getElementById('goal-name').innerText = g.name;
    document.getElementById('goal-saved').innerText = `$${g.saved.toLocaleString()}`;
    document.getElementById('goal-total').innerText = `$${g.total.toLocaleString()}`;
    document.getElementById('progress-fill').style.width = g.pct + "%";
}

/* --- popups for adding to and creating goals --- */
function openPop(id) { document.getElementById(id).style.display = 'flex'; }
function closePop(e) { 
    // Close if background clicked or no event passed (button click)
    if(!e || e.target.className === 'overlay') {
        document.querySelectorAll('.overlay').forEach(o => o.style.display = 'none');
    }
}