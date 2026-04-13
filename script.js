/* --- nav bar control --- */
function showPage(pageId) {
  document.querySelectorAll(".app-page").forEach((p) => (p.style.display = "none"));
  document.getElementById(pageId).style.display = "flex";

  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.remove("active");
    if (pageId.includes(t.innerText.toLowerCase())) t.classList.add("active");
  });
}
/* ------------------------------- TRANSACTIONS PAGE ------------------------------------------ */
const saveButton = document.getElementById("saveBtn");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const otherCategoryInput = document.getElementById("otherCategory");
const dateInput = document.getElementById("date");
const transactionList = document.getElementById("transactionList");
const typeButtons = document.querySelectorAll(".type-btn");
let selectedType = "income";
let editingTransaction = null;

typeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    typeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    selectedType = button.textContent.trim().toLowerCase();
  });
});

categorySelect.addEventListener("change", () => {
  if (categorySelect.value === "Other") {
    otherCategoryInput.style.display = "block";
  } else {
    otherCategoryInput.style.display = "none";
    otherCategoryInput.value = "";
  }
});

saveButton.addEventListener("click", () => {
  const amountValue = amountInput.value.trim();
  const selectedCategory = categorySelect.value;
  const otherCategoryValue = otherCategoryInput.value.trim();
  const dateValue = dateInput.value;

  let finalCategory = selectedCategory;

  if (selectedCategory === "Other") {
    finalCategory = otherCategoryValue;
  }

  if (amountValue === "" || finalCategory === "" || dateValue === "") {
    alert("Please fill out all fields.");
    return;
  }

  if (editingTransaction !== null) {
    updateTransaction(editingTransaction, finalCategory, dateValue, amountValue, selectedType);
    editingTransaction = null;
    saveButton.textContent = "Save";
  } else {
    createTransaction(finalCategory, dateValue, amountValue, selectedType);
  }

  clearForm();
});

function createTransaction(category, date, amount, type) {
  const transactionItem = document.createElement("div");
  transactionItem.classList.add("transaction-item", type);

  transactionItem.dataset.category = category;
  transactionItem.dataset.date = date;
  transactionItem.dataset.amount = amount;
  transactionItem.dataset.type = type;

  const leftSide = document.createElement("div");
  leftSide.classList.add("transaction-left");

  const categoryText = document.createElement("div");
  categoryText.classList.add("transaction-category");
  categoryText.textContent = category;

  const dateText = document.createElement("div");
  dateText.classList.add("transaction-date");
  dateText.textContent = formatDate(date);

  leftSide.appendChild(categoryText);
  leftSide.appendChild(dateText);

  const rightSide = document.createElement("div");
  rightSide.classList.add("transaction-right");

  const amountText = document.createElement("div");
  amountText.classList.add("transaction-amount");
  amountText.textContent = formatAmount(amount, type);

  const actionRow = document.createElement("div");
  actionRow.classList.add("transaction-actions");

  const editButton = document.createElement("button");
  editButton.classList.add("edit-btn");
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "Delete";

  editButton.addEventListener("click", () => {
    loadTransactionIntoForm(transactionItem);
  });

  deleteButton.addEventListener("click", () => {
    if (editingTransaction === transactionItem) {
      editingTransaction = null;
      saveButton.textContent = "Save";
      clearForm();
    }
    transactionItem.remove();
  });

  actionRow.appendChild(editButton);
  actionRow.appendChild(deleteButton);

  rightSide.appendChild(amountText);
  rightSide.appendChild(actionRow);

  transactionItem.appendChild(leftSide);
  transactionItem.appendChild(rightSide);

  transactionList.prepend(transactionItem);
}

function updateTransaction(transactionItem, category, date, amount, type) {
  transactionItem.dataset.category = category;
  transactionItem.dataset.date = date;
  transactionItem.dataset.amount = amount;
  transactionItem.dataset.type = type;

  transactionItem.classList.remove("income", "expense");
  transactionItem.classList.add(type);

  const categoryText = transactionItem.querySelector(".transaction-category");
  const dateText = transactionItem.querySelector(".transaction-date");
  const amountText = transactionItem.querySelector(".transaction-amount");

  categoryText.textContent = category;
  dateText.textContent = formatDate(date);
  amountText.textContent = formatAmount(amount, type);
}

function loadTransactionIntoForm(transactionItem) {
  editingTransaction = transactionItem;

  const category = transactionItem.dataset.category;
  const date = transactionItem.dataset.date;
  const amount = transactionItem.dataset.amount;
  const type = transactionItem.dataset.type;

  amountInput.value = amount;
  dateInput.value = date;
  selectedType = type;

  typeButtons.forEach((button) => {
    button.classList.remove("active");
    if (button.textContent.trim().toLowerCase() === type) {
      button.classList.add("active");
    }
  });

  const categoryOptions = Array.from(categorySelect.options).map((option) => option.value);

  if (categoryOptions.includes(category) && category !== "") {
    categorySelect.value = category;
    otherCategoryInput.style.display = "none";
    otherCategoryInput.value = "";
  } else {
    categorySelect.value = "Other";
    otherCategoryInput.style.display = "block";
    otherCategoryInput.value = category;
  }

  saveButton.textContent = "Update Transaction";
}

function clearForm() {
  amountInput.value = "";
  categorySelect.value = "";
  otherCategoryInput.value = "";
  otherCategoryInput.style.display = "none";
  dateInput.value = "";

  selectedType = "income";
  typeButtons.forEach((button) => button.classList.remove("active"));
  typeButtons[0].classList.add("active");
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function formatAmount(amount, type) {
  if (type === "income") {
    return `+$${amount}`;
  }
  return `-$${amount}`;
}
/* ------------------------------- GOALS PAGE ------------------------------------------ */

/* --- cycle through goals --- */
const goalsList = [
  { name: "Spring Break Fund", saved: 1200, total: 2000, pct: 60 },
  { name: "New Laptop", saved: 450, total: 1500, pct: 30 },
];
let goalIdx = 0;

function moveGoal(dir) {
  goalIdx = (goalIdx + dir + goalsList.length) % goalsList.length;
  const g = goalsList[goalIdx];
  document.getElementById("goal-name").innerText = g.name;
  document.getElementById("goal-saved").innerText = `$${g.saved}`;
  document.getElementById("goal-total").innerText = `$${g.total}`;
  document.getElementById("progress-fill").style.width = g.pct + "%";
}

/* --- DEEP VERTICAL TASK: ADDING A NEW GOAL --- */
function addNewGoal() {
  // 1. Grab values from the input fields
  const nameInput = document.getElementById("new-g-name").value;
  const targetInput = parseFloat(document.getElementById("new-g-target").value);
  const savedInput = parseFloat(document.getElementById("new-g-saved").value) || 0;

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
    pct: calcPct,
  };

  goalsList.push(newGoal);

  // 5. Switch view to show the newly created goal
  goalIdx = goalsList.length - 1;
  updateGoalUI();

  // 6. Clear the inputs and close the popup
  document.getElementById("new-g-name").value = "";
  document.getElementById("new-g-target").value = "";
  document.getElementById("new-g-saved").value = "";
  closePop();
}

/* HELPER: Separate UI updates to keep code clean */
function updateGoalUI() {
  const g = goalsList[goalIdx];
  
  // Update text elements
  document.getElementById("goal-name").innerText = g.name;
  document.getElementById("goal-saved").innerText = `$${g.saved.toLocaleString()}`;
  document.getElementById("goal-total").innerText = `$${g.total.toLocaleString()}`;
  
  // Update progress bar width
  const progressFill = document.getElementById("progress-fill");
  progressFill.style.width = g.pct + "%";
  
  // Optional: Update progress percentage text if you have a label for it
  const pctLabel = document.getElementById("goal-pct-label");
  if (pctLabel) {
    pctLabel.innerText = `${g.pct}%`;
  }
}

/* --- DEEP VERTICAL TASK: ADDING AMOUNT TO EXISTING GOAL --- */
function addAmountToGoal() {

  const input = document.getElementById("goal-add-amount");
  const amount = parseFloat(input.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount to add.");
    return;
  }

  const currentGoal = goalsList[goalIdx];
  currentGoal.saved += amount;
  currentGoal.pct = Math.min(Math.round((currentGoal.saved / currentGoal.total) * 100), 100);


  updateGoalUI();
  input.value = "";
  closePop();
}

/* --- popups for adding to and creating goals --- */
function openPop(id) {
  document.getElementById(id).style.display = "flex";
}
function closePop(e) {
  // Close if background clicked or no event passed (button click)
  if (!e || e.target.className === "overlay") {
    document.querySelectorAll(".overlay").forEach((o) => (o.style.display = "none"));
  }
}

/* ------------------------------- INSIGHTS PAGE ------------------------------------------ */

/* --- Category spending data --- */
const spendingData = [
  { name: "Rent", percentage: 40, color: "#5B7FFF", amount: 800 },
  { name: "Food", percentage: 25, color: "#FF69B4", amount: 500 },
  { name: "Shopping", percentage: 20, color: "#FFA500", amount: 400 },
  { name: "Transport", percentage: 15, color: "#20C997", amount: 300 },
];

/* --- Sample transaction data for each category --- */
const transactionsByCategory = {
  rent: [{ name: "Monthly Rent", amount: 800, date: "2026-03-01" }],
  food: [
    { name: "Grocery Store", amount: 120, date: "2026-03-05" },
    { name: "Restaurant", amount: 85, date: "2026-03-10" },
    { name: "Coffee Shop", amount: 45, date: "2026-03-12" },
    { name: "Grocery Store", amount: 130, date: "2026-03-18" },
    { name: "Fast Food", amount: 60, date: "2026-03-22" },
    { name: "Grocery Store", amount: 60, date: "2026-03-28" },
  ],
  shopping: [
    { name: "Clothing Store", amount: 150, date: "2026-03-08" },
    { name: "Online Purchase", amount: 89, date: "2026-03-15" },
    { name: "Electronics", amount: 161, date: "2026-03-25" },
  ],
  transport: [
    { name: "Gas Station", amount: 60, date: "2026-03-03" },
    { name: "Public Transit", amount: 45, date: "2026-03-11" },
    { name: "Gas Station", amount: 55, date: "2026-03-17" },
    { name: "Parking", amount: 25, date: "2026-03-20" },
    { name: "Gas Station", amount: 65, date: "2026-03-27" },
    { name: "Uber/Lyft", amount: 50, date: "2026-03-29" },
  ],
};

/* --- Draw pie chart using SVG --- */
function drawPieChart() {
  const svg = document.getElementById("pie-chart");
  svg.innerHTML = ""; // Clear existing slices

  let currentAngle = -90; // Start from top (12 o'clock)
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  // Filter visible categories based on checkboxes
  const visibleCategories = spendingData.filter((data, index) => {
    const checkbox = document.querySelectorAll(".category-checkbox")[index];
    return checkbox && checkbox.checked;
  });

  // Calculate total percentage of visible categories
  const totalPercentage = visibleCategories.reduce((sum, item) => sum + item.percentage, 0);

  if (totalPercentage === 0) {
    // Draw empty circle if no categories selected
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "#e5e7eb");
    svg.appendChild(circle);
    return;
  }

  visibleCategories.forEach((data, index) => {
    const sliceAngle = (data.percentage / totalPercentage) * 360;

    // Calculate arc path
    const startAngle = (currentAngle * Math.PI) / 180;
    const endAngle = ((currentAngle + sliceAngle) * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", data.color);
    path.setAttribute("class", "pie-slice");
    path.setAttribute("data-category", data.name.toLowerCase());

    // Add hover effect to show percentage
    path.addEventListener("mouseenter", function () {
      updateSummary(data.name, data.percentage);
    });

    // Add click handler to show transaction details
    path.addEventListener("click", function () {
      showTransactionDetails(data.name);
    });

    svg.appendChild(path);

    // Add text label inside the slice
    const midAngle = ((currentAngle + sliceAngle / 2) * Math.PI) / 180;
    const labelRadius = radius * 0.65; // Position label 65% from center
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", labelX);
    text.setAttribute("y", labelY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "16");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("font-family", "Inter, sans-serif");
    text.setAttribute("pointer-events", "none"); // Don't block hover on pie slice
    text.textContent = `${data.percentage}%`;

    svg.appendChild(text);

    currentAngle += sliceAngle;
  });
}

/* --- Update spending summary text --- */
function updateSummary(categoryName, percentage) {
  const summaryText = document.querySelector(".spending-summary p");
  summaryText.textContent = `You spent ${percentage}% of your budget on ${categoryName} this month.`;
}

/* --- Toggle category visibility --- */
function setupCategoryToggles() {
  const checkboxes = document.querySelectorAll(".category-checkbox");
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", function () {
      drawPieChart();

      // Update summary to show the first visible category
      const visibleCategories = spendingData.filter((data, idx) => {
        const cb = document.querySelectorAll(".category-checkbox")[idx];
        return cb && cb.checked;
      });

      if (visibleCategories.length > 0) {
        // Find the category with highest percentage
        const topCategory = visibleCategories.reduce((max, cat) => (cat.percentage > max.percentage ? cat : max));
        updateSummary(topCategory.name, topCategory.percentage);
      } else {
        document.querySelector(".spending-summary p").textContent = "Select a category to view spending insights.";
      }
    });
  });
}

/* --- Initialize insights page when loaded --- */
function initInsights() {
  drawPieChart();
  setupCategoryToggles();
}

/* --- Show transaction details modal (MODERATE TASK) --- */
function showTransactionDetails(categoryName) {
  const categoryKey = categoryName.toLowerCase();
  const transactions = transactionsByCategory[categoryKey] || [];

  // Update modal title
  document.getElementById("modal-category-title").textContent = `${categoryName} Transactions`;

  // Populate transaction list
  const listContainer = document.getElementById("transaction-list");
  listContainer.innerHTML = "";

  if (transactions.length === 0) {
    listContainer.innerHTML = '<p style="text-align: center; color: #6b7280;">No transactions found</p>';
  } else {
    transactions.forEach((trans) => {
      const item = document.createElement("div");
      item.className = "transaction-item";
      item.innerHTML = `
                <div>
                    <div class="trans-name">${trans.name}</div>
                    <div class="trans-date">${trans.date}</div>
                </div>
                <div class="trans-amount">$${trans.amount}</div>
            `;
      listContainer.appendChild(item);
    });
  }

  // Show modal
  document.getElementById("transaction-details-modal").style.display = "flex";
}

/* --- Close transaction modal --- */
function closeTransactionModal(e) {
  if (!e || e.target.id === "transaction-details-modal" || e.target.className.includes("btn")) {
    document.getElementById("transaction-details-modal").style.display = "none";
  }
}

/* --- Apply date filter (MODERATE TASK) --- */
function applyDateFilter() {
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  // In a real app, this would filter the data by date range
  // For now, we'll just redraw with a message
  const summaryText = document.querySelector(".spending-summary p");
  summaryText.textContent = `Showing data from ${startDate} to ${endDate}. You spent 40% of your budget on Rent.`;

  drawPieChart();
}

/* --- Toggle comparison view (MODERATE TASK) --- */
function toggleComparison() {
  const singleView = document.getElementById("single-chart-view");
  const compareView = document.getElementById("comparison-view");

  if (compareView.style.display === "none") {
    // Show comparison view
    singleView.style.display = "none";
    compareView.style.display = "block";
    drawComparisonCharts();
  } else {
    // Show single view
    singleView.style.display = "block";
    compareView.style.display = "none";
  }
}

/* --- Draw comparison charts --- */
function drawComparisonCharts() {
  // Draw first comparison chart (simulated February data - slightly different)
  drawComparisonChart("pie-chart-compare-1", [
    { name: "Rent", percentage: 45, color: "#5B7FFF" },
    { name: "Food", percentage: 20, color: "#FF69B4" },
    { name: "Shopping", percentage: 25, color: "#FFA500" },
    { name: "Transport", percentage: 10, color: "#20C997" },
  ]);

  // Draw second comparison chart (March data - current)
  drawComparisonChart("pie-chart-compare-2", spendingData);
}

/* --- Draw a single comparison pie chart --- */
function drawComparisonChart(svgId, data) {
  const svg = document.getElementById(svgId);
  svg.innerHTML = "";

  let currentAngle = -90;
  const radius = 70;
  const centerX = 100;
  const centerY = 100;

  data.forEach((item) => {
    const sliceAngle = (item.percentage / 100) * 360;

    const startAngle = (currentAngle * Math.PI) / 180;
    const endAngle = ((currentAngle + sliceAngle) * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", item.color);

    svg.appendChild(path);

    // Add label
    const midAngle = ((currentAngle + sliceAngle / 2) * Math.PI) / 180;
    const labelRadius = radius * 0.65;
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", labelX);
    text.setAttribute("y", labelY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "14");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("font-family", "Inter, sans-serif");
    text.textContent = `${item.percentage}%`;

    svg.appendChild(text);

    currentAngle += sliceAngle;
  });
}

// Run when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInsights);
} else {
  initInsights();
}