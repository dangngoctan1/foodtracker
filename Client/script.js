const foodData = {
  dongvat: [
    { image: "thitga.jpg", name: "Thịt gà", calo: 250, protein: 30 },
    { image: "thitbo.jpg", name: "Thịt bò", calo: 270, protein: 28 },
    { image: "cahoi.jpg", name: "Cá hồi", calo: 200, protein: 26 },
  ],
  raucu: [
    { image: "carot.jpg", name: "Cà rốt", calo: 41, protein: 1 },
    { image: "bongcai.jpg", name: "Bông cải", calo: 55, protein: 3.7 },
    { image: "bido.jpg", name: "Bí đỏ", calo: 49, protein: 1.2 },
  ],
  traicay: [
    { image: "tao.jpg", name: "Táo", calo: 95, protein: 0.5 },
    { image: "chuoi.jpg", name: "Chuối", calo: 105, protein: 1.3 },
    { image: "cam.jpg", name: "Cam", calo: 62, protein: 1.2 },
  ],
};

let currentMeal = [];
let tempMealHistory = [];
let isLoggedIn = false;
let currentUser = null;
let userWeight = null;

const categoryTitles = {
  dongvat: "Thức ăn từ động vật",
  raucu: "Rau củ tươi xanh",
  traicay: "Trái cây bổ dưỡng",
};

// Hiển thị toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 1000);
}

// Mock login/logout functionality
function toggleLogin() {
  const loginBtn = document.querySelector(".auth .login");
  const registerBtn = document.querySelector(".auth .register");

  if (isLoggedIn) {
    isLoggedIn = false;
    currentUser = null;
    loginBtn.textContent = "Đăng nhập";
    registerBtn.textContent = "Đăng ký";
    registerBtn.style.display = "inline-block";
    showToast("Bạn đã đăng xuất!");
  } else {
    isLoggedIn = true;
    currentUser = { id: "user123" };
    loginBtn.textContent = "Đăng xuất";
    registerBtn.style.display = "none";
    showToast("Bạn đã đăng nhập!");
  }
}

// Xử lý dropdown navbar bằng click
document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const parent = toggle.parentElement;
    const isActive = parent.classList.contains("active");

    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("active");
    });

    if (!isActive) {
      parent.classList.add("active");
    }
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  }
});

// Tìm kiếm món ăn
function searchFoods() {
  const query = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();
  const list = document.getElementById("food-list");
  const mealPlanSection = document.getElementById("meal-plan");
  const historySection = document.getElementById("history");
  const categoryTitle = document.getElementById("category-title");
  const nutritionTips = document.getElementById("nutrition-tips");
  const nutritionSection = document.getElementById("nutrition-section");

  list.classList.remove("hidden");
  mealPlanSection.classList.add("hidden");
  historySection.classList.add("hidden");
  categoryTitle.classList.remove("hidden");
  nutritionTips.classList.add("hidden");
  nutritionSection.classList.add("hidden");

  categoryTitle.textContent = query
    ? `Kết quả tìm kiếm cho "${query}"`
    : "Tìm kiếm món ăn";
  list.innerHTML = "";

  let foundFoods = [];
  Object.keys(foodData).forEach((category) => {
    const matches = foodData[category].filter((mon) =>
      mon.name.toLowerCase().includes(query)
    );
    matches.forEach((mon, index) => {
      foundFoods.push({ ...mon, category, index });
    });
  });

  if (foundFoods.length === 0) {
    list.innerHTML = "<p>Không tìm thấy món ăn nào.</p>";
    return;
  }

  foundFoods.forEach((mon) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
        <img class="food-img" src="images/${mon.category}/${mon.image}" alt="${mon.name}" onerror="this.src='images/placeholder.jpg'; this.alt='Ảnh không khả dụng';">
        <h3>${mon.name}</h3>
        <div class="food-info">
          <img class="icon" src="images/icon/ngonlua.jpg" alt="calo">
          <span>${mon.calo} kcal</span>
        </div>
        <div class="food-info">
          <img class="icon" src="images/icon/cobap.jpg" alt="protein">
          <span>${mon.protein}g protein</span>
        </div>
        <button class="add-btn" onclick="addToMealPlan('${mon.category}', ${mon.index})">Thêm vào thực đơn</button>
      `;
    list.appendChild(card);
  });
}

// Hỗ trợ tìm kiếm bằng phím Enter
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchFoods();
  }
});

// Hiển thị danh sách món ăn theo danh mục
function showCategory(category) {
  const list = document.getElementById("food-list");
  const mealPlanSection = document.getElementById("meal-plan");
  const historySection = document.getElementById("history");
  const categoryTitle = document.getElementById("category-title");
  const nutritionTips = document.getElementById("nutrition-tips");
  const nutritionSection = document.getElementById("nutrition-section");

  list.classList.remove("hidden");
  mealPlanSection.classList.add("hidden");
  historySection.classList.add("hidden");
  categoryTitle.classList.remove("hidden");
  nutritionTips.classList.remove("hidden");
  nutritionSection.classList.add("hidden");

  categoryTitle.textContent = categoryTitles[category] || "Danh sách món ăn";
  list.innerHTML = "";

  foodData[category].forEach((mon, index) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
        <img class="food-img" src="images/${category}/${mon.image}" alt="${mon.name}" onerror="this.src='images/placeholder.jpg'; this.alt='Ảnh không khả dụng';">
        <h3>${mon.name}</h3>
        <div class="food-info">
          <img class="icon" src="images/icon/ngonlua.jpg" alt="calo">
          <span>${mon.calo} kcal</span>
        </div>
        <div class="food-info">
          <img class="icon" src="images/icon/cobap.jpg" alt="protein">
          <span>${mon.protein}g protein</span>
        </div>
        <button class="add-btn" onclick="addToMealPlan('${category}', ${index})">Thêm vào thực đơn</button>
      `;
    list.appendChild(card);
  });
}

// Thêm món ăn vào thực đơn với logic cộng dồn
function addToMealPlan(category, index) {
  const food = { ...foodData[category][index], category };
  const existingItem = currentMeal.find((item) => item.name === food.name);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
    existingItem.totalCalo = existingItem.calo * existingItem.quantity;
    existingItem.totalProtein = existingItem.protein * existingItem.quantity;
  } else {
    food.quantity = 1;
    food.totalCalo = food.calo;
    food.totalProtein = food.protein;
    currentMeal.push(food);
  }

  showToast(`${food.name} đã được thêm vào thực đơn!`);
}

// Xóa món ăn khỏi thực đơn
function removeFromMealPlan(index) {
  const removedItem = currentMeal.splice(index, 1)[0];
  showToast(`${removedItem.name} đã được xóa khỏi thực đơn!`);
  showMealPlan();
}

// Hiển thị thực đơn hiện tại
function showMealPlan() {
  const list = document.getElementById("food-list");
  const mealPlanSection = document.getElementById("meal-plan");
  const mealList = document.getElementById("meal-list");
  const historySection = document.getElementById("history");
  const categoryTitle = document.getElementById("category-title");
  const nutritionTips = document.getElementById("nutrition-tips");
  const nutritionSection = document.getElementById("nutrition-section");
  const mealTotals = document.getElementById("meal-totals");
  const totalCaloriesEl = document.getElementById("total-calories");
  const totalProteinEl = document.getElementById("total-protein");

  list.classList.add("hidden");
  mealPlanSection.classList.remove("hidden");
  historySection.classList.add("hidden");
  categoryTitle.classList.add("hidden");
  nutritionTips.classList.add("hidden");
  nutritionSection.classList.add("hidden");

  mealList.innerHTML = "";

  if (currentMeal.length === 0) {
    mealList.innerHTML = "<p>Thực đơn của bạn hiện tại trống.</p>";
    mealTotals.classList.add("hidden");
    return;
  }

  const totalCalories = currentMeal.reduce(
    (sum, mon) => sum + mon.totalCalo,
    0
  );
  const totalProtein = currentMeal.reduce(
    (sum, mon) => sum + mon.totalProtein,
    0
  );

  mealTotals.classList.remove("hidden");
  totalCaloriesEl.textContent = totalCalories;
  totalProteinEl.textContent = totalProtein;

  currentMeal.forEach((mon, index) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
        <h3>${mon.name}</h3>
        <div class="quantity">Số lượng: ${mon.quantity}</div>
        <div class="food-info">
          <img class="icon" src="images/icon/ngonlua.jpg" alt="calo">
          <span>${mon.totalCalo} kcal</span>
        </div>
        <div class="food-info">
          <img class="icon" src="images/icon/cobap.jpg" alt="protein">
          <span>${mon.totalProtein}g protein</span>
        </div>
        <button class="remove-btn" onclick="removeFromMealPlan(${index})">Xóa</button>
      `;
    mealList.appendChild(card);
  });
}

// Lưu bữa ăn vào lịch sử
function saveMealToHistory() {
  if (currentMeal.length === 0) {
    showToast("Thực đơn của bạn hiện tại trống!");
    return;
  }

  if (!isLoggedIn) {
    showToast("Vui lòng đăng nhập để lưu lịch sử bữa ăn!");
    return;
  }

  const timestamp = new Date().toLocaleString("vi-VN");
  const mealEntry = {
    timestamp: timestamp,
    items: currentMeal,
    totalCalories: currentMeal.reduce((sum, mon) => sum + mon.totalCalo, 0),
    totalProtein: currentMeal.reduce((sum, mon) => sum + mon.totalProtein, 0),
  };

  const userHistory =
    JSON.parse(localStorage.getItem(`mealHistory_${currentUser.id}`)) || [];
  userHistory.push(mealEntry);
  localStorage.setItem(
    `mealHistory_${currentUser.id}`,
    JSON.stringify(userHistory)
  );

  if (!isLoggedIn) {
    tempMealHistory.push(mealEntry);
  }

  showToast("Bữa ăn đã được lưu vào lịch sử!");
  currentMeal = [];
  showMealPlan();
}

// Hiển thị lịch sử bữa ăn
function showHistory() {
  const list = document.getElementById("food-list");
  const mealPlanSection = document.getElementById("meal-plan");
  const historySection = document.getElementById("history");
  const historyList = document.getElementById("history-list");
  const categoryTitle = document.getElementById("category-title");
  const nutritionTips = document.getElementById("nutrition-tips");
  const nutritionSection = document.getElementById("nutrition-section");

  list.classList.add("hidden");
  mealPlanSection.classList.add("hidden");
  historySection.classList.remove("hidden");
  categoryTitle.classList.add("hidden");
  nutritionTips.classList.add("hidden");
  nutritionSection.classList.add("hidden");

  if (!isLoggedIn) {
    historyList.innerHTML = "<p>Vui lòng đăng nhập để xem lịch sử bữa ăn.</p>";
    return;
  }

  const history =
    JSON.parse(localStorage.getItem(`mealHistory_${currentUser.id}`)) || [];

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<p>Chưa có lịch sử bữa ăn.</p>";
    return;
  }

  history.forEach((entry) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    let itemsHtml = entry.items
      .map(
        (item) =>
          `<p>${item.name} (x${item.quantity}): ${item.totalCalo} kcal, ${item.totalProtein}g protein</p>`
      )
      .join("");
    historyItem.innerHTML = `
        <h4>Bữa ăn lúc ${entry.timestamp}</h4>
        ${itemsHtml}
        <p><strong>Tổng:</strong> ${entry.totalCalories} kcal, ${entry.totalProtein}g protein</p>
      `;
    historyList.appendChild(historyItem);
  });
}

// Dinh dưỡng: Calo là gì?
function showCaloInfo() {
  const list = document.getElementById("food-list");
  const mealPlanSection = document.getElementById("meal-plan");
  const historySection = document.getElementById("history");
  const categoryTitle = document.getElementById("category-title");
  const nutritionTips = document.getElementById("nutrition-tips");
  const nutritionSection = document.getElementById("nutrition-section");
  const caloInfo = document.getElementById("calo-info");
  const proteinInfo = document.getElementById("protein-info");
  const mealSuggestions = document.getElementById("meal-suggestions");

  list.classList.add("hidden");
  mealPlanSection.classList.add("hidden");
  historySection.classList.add("hidden");
  categoryTitle.classList.add("hidden");
  nutritionTips.classList.add("hidden");
  nutritionSection.classList.remove("hidden");

  caloInfo.classList.remove("hidden");
  proteinInfo.classList.add("hidden");
  mealSuggestions.classList.add("hidden");
}

// Tính lượng calo cần thiết
function calculateCaloNeeds() {
  const age = parseInt(document.getElementById("age").value);
  const weight = parseInt(document.getElementById("weight").value);
  const height = parseInt(document.getElementById("height").value);
  const activity = parseFloat(document.getElementById("activity").value);

  if (!age || !weight || !height) {
    showToast("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (age < 18 || age > 100) {
    showToast("Tuổi phải từ 18 đến 100!");
    return;
  }

  if (weight < 30 || weight > 200) {
    showToast("Cân nặng phải từ 30 đến 200 kg!");
    return;
  }

  if (height < 100 || height > 250) {
    showToast("Chiều cao phải từ 100 đến 250 cm!");
    return;
  }

  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const dailyCalo = Math.round(bmr * activity);

  userWeight = weight;

  document.getElementById(
    "calo-result"
  ).innerHTML = `Bạn cần khoảng <strong>${dailyCalo} kcal</strong> mỗi ngày để duy trì cân nặng.`;
}

// Dinh dưỡng: Protein là gì?
function showProteinInfo() {
  const list = document.getElementById("food-list");
  const mealPlanSection = document.getElementById("meal-plan");
  const historySection = document.getElementById("history");
  const categoryTitle = document.getElementById("category-title");
  const nutritionTips = document.getElementById("nutrition-tips");
  const nutritionSection = document.getElementById("nutrition-section");
  const caloInfo = document.getElementById("calo-info");
  const proteinInfo = document.getElementById("protein-info");
  const mealSuggestions = document.getElementById("meal-suggestions");
  const proteinChart = document.getElementById("protein-chart");
  const proteinRecommendation = document.getElementById(
    "protein-recommendation"
  );
  const proteinNeeds = document.getElementById("protein-needs");
  const proteinProgressBar = document.getElementById("protein-progress-bar");
  const proteinProgressText = document.getElementById("protein-progress-text");

  list.classList.add("hidden");
  mealPlanSection.classList.add("hidden");
  historySection.classList.add("hidden");
  categoryTitle.classList.add("hidden");
  nutritionTips.classList.add("hidden");
  nutritionSection.classList.remove("hidden");

  caloInfo.classList.add("hidden");
  proteinInfo.classList.remove("hidden");
  mealSuggestions.classList.add("hidden");

  if (userWeight) {
    const proteinRequirement = (userWeight * 0.8).toFixed(1);
    proteinNeeds.textContent = `Dựa trên cân nặng của bạn (${userWeight} kg), bạn cần khoảng ${proteinRequirement}g protein mỗi ngày.`;
    proteinRecommendation.classList.remove("hidden");

    const totalProteinToday = currentMeal.reduce(
      (sum, mon) => sum + mon.totalProtein,
      0
    );
    const progressPercent = Math.min(
      (totalProteinToday / proteinRequirement) * 100,
      100
    );
    proteinProgressBar.style.width = `${progressPercent}%`;
    proteinProgressText.textContent = `Bạn đã tiêu thụ ${totalProteinToday}g protein hôm nay (${Math.round(
      progressPercent
    )}% mục tiêu).`;
  } else {
    proteinRecommendation.classList.add("hidden");
  }

  // New protein comparison with circular progress rings
  proteinChart.innerHTML = "";
  const foodsToCompare = [
    foodData.dongvat[0], // Thịt gà: 30g protein
    foodData.dongvat[1], // Thịt bò: 28g protein
    foodData.raucu[0], // Cà rốt: 1g protein
    foodData.traicay[0], // Táo: 0.5g protein
  ];

  const referenceProtein = 20; // Reference value for comparison (e.g., 20g as a daily portion goal)

  foodsToCompare.forEach((food) => {
    const percentage = (food.protein / referenceProtein) * 100;
    const dashOffset = 314 - (314 * percentage) / 100; // 314 is the circumference of the circle (2 * π * 50)

    const ring = document.createElement("div");
    ring.className = "protein-ring";
    ring.innerHTML = `
        <svg>
          <circle class="ring-bg" cx="60" cy="60" r="50" />
          <circle class="ring-fill" cx="60" cy="60" r="50" style="stroke-dashoffset: ${dashOffset};" />
        </svg>
        <div class="ring-text">
          ${food.name}<br>
          <span>${food.protein}g (${Math.round(percentage)}%)</span>
        </div>
      `;
    proteinChart.appendChild(ring);
  });
}

// Dinh dưỡng: Thực đơn gợi ý
function showMealSuggestions() {
  const list = document.getElementById("food-list");
  const mealPlanSection = document.getElementById("meal-plan");
  const historySection = document.getElementById("history");
  const categoryTitle = document.getElementById("category-title");
  const nutritionTips = document.getElementById("nutrition-tips");
  const nutritionSection = document.getElementById("nutrition-section");
  const caloInfo = document.getElementById("calo-info");
  const proteinInfo = document.getElementById("protein-info");
  const mealSuggestions = document.getElementById("meal-suggestions");

  list.classList.add("hidden");
  mealPlanSection.classList.add("hidden");
  historySection.classList.add("hidden");
  categoryTitle.classList.add("hidden");
  nutritionTips.classList.add("hidden");
  nutritionSection.classList.remove("hidden");

  caloInfo.classList.add("hidden");
  proteinInfo.classList.add("hidden");
  mealSuggestions.classList.remove("hidden");
}
