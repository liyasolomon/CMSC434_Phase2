/* --- nav bar control --- */
function showPage(pageId) {
    document.querySelectorAll('.app-page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'flex';
    
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
        if(pageId.includes(t.innerText.toLowerCase())) t.classList.add('active');
    });
}

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

/* --- popups for adding to and creating goals --- */
function openPop(id) { document.getElementById(id).style.display = 'flex'; }
function closePop(e) { 
    // Close if background clicked or no event passed (button click)
    if(!e || e.target.className === 'overlay') {
        document.querySelectorAll('.overlay').forEach(o => o.style.display = 'none');
    }
}