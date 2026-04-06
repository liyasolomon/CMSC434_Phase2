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

/* ------------------------------- INSIGHTS PAGE ------------------------------------------ */

/* --- Category spending data --- */
const spendingData = [
    { name: "Rent", percentage: 40, color: "#5B7FFF", amount: 800 },
    { name: "Food", percentage: 25, color: "#FF69B4", amount: 500 },
    { name: "Shopping", percentage: 20, color: "#FFA500", amount: 400 },
    { name: "Transport", percentage: 15, color: "#20C997", amount: 300 }
];

/* --- Draw pie chart using SVG --- */
function drawPieChart() {
    const svg = document.getElementById('pie-chart');
    svg.innerHTML = ''; // Clear existing slices
    
    let currentAngle = -90; // Start from top (12 o'clock)
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    // Filter visible categories based on checkboxes
    const visibleCategories = spendingData.filter((data, index) => {
        const checkbox = document.querySelectorAll('.category-checkbox')[index];
        return checkbox && checkbox.checked;
    });
    
    // Calculate total percentage of visible categories
    const totalPercentage = visibleCategories.reduce((sum, item) => sum + item.percentage, 0);
    
    if (totalPercentage === 0) {
        // Draw empty circle if no categories selected
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', '#e5e7eb');
        svg.appendChild(circle);
        return;
    }
    
    visibleCategories.forEach((data, index) => {
        const sliceAngle = (data.percentage / totalPercentage) * 360;
        
        // Calculate arc path
        const startAngle = currentAngle * Math.PI / 180;
        const endAngle = (currentAngle + sliceAngle) * Math.PI / 180;
        
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const largeArcFlag = sliceAngle > 180 ? 1 : 0;
        
        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', data.color);
        path.setAttribute('class', 'pie-slice');
        path.setAttribute('data-category', data.name.toLowerCase());
        
        // Add hover effect to show percentage
        path.addEventListener('mouseenter', function() {
            updateSummary(data.name, data.percentage);
        });
        
        svg.appendChild(path);
        
        // Add text label inside the slice
        const midAngle = (currentAngle + sliceAngle / 2) * Math.PI / 180;
        const labelRadius = radius * 0.65; // Position label 65% from center
        const labelX = centerX + labelRadius * Math.cos(midAngle);
        const labelY = centerY + labelRadius * Math.sin(midAngle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.setAttribute('pointer-events', 'none'); // Don't block hover on pie slice
        text.textContent = `${data.percentage}%`;
        
        svg.appendChild(text);
        
        currentAngle += sliceAngle;
    });
}

/* --- Update spending summary text --- */
function updateSummary(categoryName, percentage) {
    const summaryText = document.querySelector('.spending-summary p');
    summaryText.textContent = `You spent ${percentage}% of your budget on ${categoryName} this month.`;
}

/* --- Toggle category visibility --- */
function setupCategoryToggles() {
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            drawPieChart();
            
            // Update summary to show the first visible category
            const visibleCategories = spendingData.filter((data, idx) => {
                const cb = document.querySelectorAll('.category-checkbox')[idx];
                return cb && cb.checked;
            });
            
            if (visibleCategories.length > 0) {
                // Find the category with highest percentage
                const topCategory = visibleCategories.reduce((max, cat) => 
                    cat.percentage > max.percentage ? cat : max
                );
                updateSummary(topCategory.name, topCategory.percentage);
            } else {
                document.querySelector('.spending-summary p').textContent = 
                    'Select a category to view spending insights.';
            }
        });
    });
}

/* --- Initialize insights page when loaded --- */
function initInsights() {
    drawPieChart();
    setupCategoryToggles();
}

// Run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInsights);
} else {
    initInsights();
}