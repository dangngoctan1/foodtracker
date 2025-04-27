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
  tinhbot: [
    { image: "comtrang.jpg", name: "Cơm trắng", calo: 130, protein: 2.7 },
    { image: "banhmi.jpg", name: "Bánh mì trắng", calo: 265, protein: 9 },
    { image: "khoaitay.jpg", name: "Khoai tây luộc", calo: 87, protein: 1.9 },
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
  tinhbot: "Thực phẩm giàu Tinh bột & Carb",
};

function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    let parent = element;
    let isVisible = true;
    while (parent && parent !== document.body) {
      if (parent.classList.contains("hidden")) {
        isVisible = false;
        break;
      }
      parent = parent.parentElement;
    }

    if (isVisible) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      console.warn(
        `Attempted to scroll to hidden element or element within hidden parent: ${elementId}`
      );
    }
  } else {
    console.warn(`Element with ID not found for scrolling: ${elementId}`);
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 1000);
}

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

function hideAllSections() {
  document.getElementById("food-section")?.classList.add("hidden");
  document.getElementById("nutrition-tips")?.classList.add("hidden");
  document.getElementById("nutrition-section")?.classList.add("hidden");
  document.getElementById("meal-plan")?.classList.add("hidden");
  document.getElementById("history")?.classList.add("hidden");
  document.getElementById("calo-info")?.classList.add("hidden");
  document.getElementById("protein-info")?.classList.add("hidden");
  document.getElementById("meal-suggestions")?.classList.add("hidden");
  document.getElementById("bmi-calculator-section")?.classList.add("hidden");
  document.getElementById("ibw-calculator-section")?.classList.add("hidden");
}

function searchFoods() {
  const query = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();
  const list = document.getElementById("food-list");
  const foodSection = document.getElementById("food-section");
  const categoryTitle = document.getElementById("category-title");

  hideAllSections();
  foodSection.classList.remove("hidden");
  list.classList.remove("hidden");
  categoryTitle.classList.remove("hidden");

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
    smoothScrollTo("food-section");
    return;
  }

  foundFoods.forEach((mon) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
        <img class="food-img" src="images/${mon.category}/${mon.image}" alt="${mon.name}" onerror="this.src='images/placeholder.jpg'; this.alt='Ảnh không khả dụng';">
        <h3>${mon.name}</h3>
        <div class="food-info">
          <img class="icon" src="images/icon/ngonlua.jpg" alt="calo"> <span>${mon.calo} kcal</span>
        </div>
        <div class="food-info">
          <img class="icon" src="images/icon/cobap.jpg" alt="protein"> <span>${mon.protein}g protein</span>
        </div>
        <button class="add-btn" onclick="addToMealPlan('${mon.category}', ${mon.index})">Thêm vào thực đơn</button>
      `;
    list.appendChild(card);
  });

  smoothScrollTo("food-section");
}

document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchFoods();
  }
});

function showCategory(category) {
  const list = document.getElementById("food-list");
  const foodSection = document.getElementById("food-section");
  const categoryTitle = document.getElementById("category-title");
  const nutritionTips = document.getElementById("nutrition-tips");

  hideAllSections();
  foodSection.classList.remove("hidden");
  list.classList.remove("hidden");
  categoryTitle.classList.remove("hidden");
  nutritionTips.classList.remove("hidden");

  categoryTitle.textContent = categoryTitles[category] || "Danh sách món ăn";
  list.innerHTML = "";

  foodData[category].forEach((mon, index) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
        <img class="food-img" src="images/${category}/${mon.image}" alt="${mon.name}" onerror="this.src='images/placeholder.jpg'; this.alt='Ảnh không khả dụng';">
        <h3>${mon.name}</h3>
        <div class="food-info">
          <img class="icon" src="images/icon/ngonlua.jpg" alt="calo"> <span>${mon.calo} kcal</span>
        </div>
        <div class="food-info">
          <img class="icon" src="images/icon/cobap.jpg" alt="protein"> <span>${mon.protein}g protein</span>
        </div>
        <button class="add-btn" onclick="addToMealPlan('${category}', ${index})">Thêm vào thực đơn</button>
      `;
    list.appendChild(card);
  });

  smoothScrollTo("food-section");
}

function showMealPlan() {
  const mealPlanSection = document.getElementById("meal-plan");
  const mealList = document.getElementById("meal-list");
  const mealTotals = document.getElementById("meal-totals");
  const totalCaloriesEl = document.getElementById("total-calories");
  const totalProteinEl = document.getElementById("total-protein");

  hideAllSections();
  mealPlanSection.classList.remove("hidden");

  mealList.innerHTML = "";

  if (currentMeal.length === 0) {
    mealList.innerHTML = "<p>Thực đơn của bạn hiện tại trống.</p>";
    mealTotals.classList.add("hidden");
    smoothScrollTo("meal-plan");
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
          <img class="icon" src="images/icon/ngonlua.jpg" alt="calo"> <span>${mon.totalCalo} kcal</span>
        </div>
        <div class="food-info">
          <img class="icon" src="images/icon/cobap.jpg" alt="protein"> <span>${mon.totalProtein}g protein</span>
        </div>
        <button class="remove-btn" onclick="removeFromMealPlan(${index})">Xóa</button>
      `;
    mealList.appendChild(card);
  });

  smoothScrollTo("meal-plan");
}

function showHistory() {
  const historySection = document.getElementById("history");
  const historyList = document.getElementById("history-list");

  hideAllSections();
  historySection.classList.remove("hidden");

  if (!isLoggedIn) {
    historyList.innerHTML = "<p>Vui lòng đăng nhập để xem lịch sử bữa ăn.</p>";
    smoothScrollTo("history");
    return;
  }

  const history =
    JSON.parse(localStorage.getItem(`mealHistory_${currentUser.id}`)) || [];
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<p>Chưa có lịch sử bữa ăn.</p>";
    smoothScrollTo("history");
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

  smoothScrollTo("history");
}

function showCaloInfo() {
  const nutritionSection = document.getElementById("nutrition-section");
  const caloInfo = document.getElementById("calo-info");

  hideAllSections();
  nutritionSection.classList.remove("hidden");
  caloInfo.classList.remove("hidden");

  smoothScrollTo("calo-info");
}

function showProteinInfo() {
  const nutritionSection = document.getElementById("nutrition-section");
  const proteinInfo = document.getElementById("protein-info");
  const proteinChart = document.getElementById("protein-chart");
  const proteinRecommendation = document.getElementById(
    "protein-recommendation"
  );
  const proteinNeeds = document.getElementById("protein-needs");
  const proteinProgressBar = document.getElementById("protein-progress-bar");
  const proteinProgressText = document.getElementById("protein-progress-text");

  hideAllSections();
  nutritionSection.classList.remove("hidden");
  proteinInfo.classList.remove("hidden");

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

  proteinChart.innerHTML = "";
  const foodsToCompare = [
    foodData.dongvat[0],
    foodData.dongvat[1],
    foodData.raucu[0],
    foodData.traicay[0],
  ];
  const referenceProtein = 20;
  foodsToCompare.forEach((food) => {
    const percentage = (food.protein / referenceProtein) * 100;
    const initialDashOffset = 314; // Start fully hidden
    const finalDashOffset = 314 - (314 * Math.min(percentage, 100)) / 100; // Calculate final offset, cap at 100%

    const ring = document.createElement("div");
    ring.className = "protein-ring";
    ring.style.opacity = 0; // Start hidden for fade-in
    ring.innerHTML = `
        <svg>
          <circle class="ring-bg" cx="60" cy="60" r="50" />
          <circle class="ring-fill" cx="60" cy="60" r="50" style="stroke-dashoffset: ${initialDashOffset};" />
        </svg>
        <div class="ring-text">${food.name}<br><span>${
      food.protein
    }g (${Math.round(percentage)}%)</span></div>`;
    proteinChart.appendChild(ring);

    // Trigger animation after appending and slight delay for render
    setTimeout(() => {
      ring.style.opacity = 1; // Fade in
      const fillCircle = ring.querySelector(".ring-fill");
      if (fillCircle) fillCircle.style.strokeDashoffset = finalDashOffset; // Animate stroke
    }, 50);
  });

  smoothScrollTo("protein-info");
}

function showMealSuggestions() {
  const nutritionSection = document.getElementById("nutrition-section");
  const mealSuggestions = document.getElementById("meal-suggestions");

  hideAllSections();
  nutritionSection.classList.remove("hidden");
  mealSuggestions.classList.remove("hidden");

  smoothScrollTo("meal-suggestions");
}

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

function removeFromMealPlan(index) {
  const removedItem = currentMeal.splice(index, 1)[0];
  showToast(`${removedItem.name} đã được xóa khỏi thực đơn!`);
  showMealPlan();
}

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
    items: [...currentMeal],
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

  showToast("Bữa ăn đã được lưu vào lịch sử!");
  currentMeal = [];
  showMealPlan();
}

function calculateCaloNeeds() {
  const age = parseInt(document.getElementById("age").value);
  const weight = parseInt(document.getElementById("weight").value);
  const height = parseInt(document.getElementById("height").value);
  const activity = parseFloat(document.getElementById("activity").value);
  const resultEl = document.getElementById("calo-result");

  if (!age || !weight || !height) {
    showToast("Vui lòng nhập đầy đủ thông tin!");
    resultEl.innerHTML = "";
    return;
  }
  if (
    age < 18 ||
    age > 100 ||
    weight < 30 ||
    weight > 200 ||
    height < 100 ||
    height > 250
  ) {
    showToast("Vui lòng nhập giá trị hợp lệ!");
    resultEl.innerHTML = "";
    return;
  }

  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const dailyCalo = Math.round(bmr * activity);
  userWeight = weight;
  resultEl.innerHTML = `Bạn cần khoảng <strong>${dailyCalo} kcal</strong> mỗi ngày để duy trì cân nặng.`;
}

document.addEventListener("DOMContentLoaded", () => {
  hideAllSections();

  const carouselSlides = document.querySelector(".carousel-slides");
  if (carouselSlides) {
    const images = carouselSlides.querySelectorAll(".carousel-image");
    if (images.length > 0) {
      const imageCount = images.length;
      let currentIndex = 0;
      const slideWidth = 100 / imageCount;

      function nextSlide() {
        currentIndex = (currentIndex + 1) % imageCount;
        const offset = -currentIndex * slideWidth;
        carouselSlides.style.transform = `translateX(${offset}%)`;
      }
      setInterval(nextSlide, 3000);
    }
  }
  const yearSpan = document.getElementById("copyright-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear(); // Lấy năm hiện tại
  }

  const fontSizeToggle = document.getElementById("font-size-toggle");
  const fontSizeIndicator = fontSizeToggle.querySelector(
    ".font-size-indicator"
  );
  const htmlElement = document.documentElement; // Lấy thẻ <html>
  const maxFontSizeLevel = 3; // Có 4 level (0, 1, 2, 3)

  let currentFontSizeLevel;

  // Function to apply font size
  const applyFontSize = (level) => {
    // Xóa các class font-size cũ
    for (let i = 0; i <= maxFontSizeLevel; i++) {
      htmlElement.classList.remove(`font-size-${i}`);
    }
    // Thêm class mới
    htmlElement.classList.add(`font-size-${level}`);
    // Cập nhật số chỉ báo trên nút
    fontSizeIndicator.textContent = level + 1; // Hiển thị 1, 2, 3, 4
    currentFontSizeLevel = level; // Lưu level hiện tại
  };

  // Check local storage for saved font size preference
  const savedFontSizeLevel = localStorage.getItem("fontSizeLevel");
  if (savedFontSizeLevel !== null) {
    applyFontSize(parseInt(savedFontSizeLevel, 10));
  } else {
    applyFontSize(1); // Mặc định là level 1 (100%)
  }

  // Add click event listener to the font size toggle button
  fontSizeToggle.addEventListener("click", () => {
    let nextLevel = (currentFontSizeLevel + 1) % (maxFontSizeLevel + 1); // Quay vòng từ 0 đến 3
    applyFontSize(nextLevel);
    // Save the new font size preference to local storage
    localStorage.setItem("fontSizeLevel", nextLevel);
  });

  // --- Night Mode Logic ---
  const nightModeToggle = document.getElementById("night-mode-toggle");
  const body = document.body;
  const moonIcon = nightModeToggle.querySelector(".moon-icon");
  const sunIcon = nightModeToggle.querySelector(".sun-icon");

  // Function to apply the theme
  const applyTheme = (theme) => {
    if (theme === "night") {
      body.classList.add("night-mode");
      moonIcon.style.display = "none";
      sunIcon.style.display = "inline-block";
    } else {
      body.classList.remove("night-mode");
      moonIcon.style.display = "inline-block";
      sunIcon.style.display = "none";
    }
  };

  // Check local storage for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Optional: Set default based on system preference if no saved theme
    // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // applyTheme(prefersDark ? 'night' : 'day');
    applyTheme("day"); // Default to day mode if nothing saved
  }

  // Add click event listener to the toggle button
  nightModeToggle.addEventListener("click", () => {
    const isNightMode = body.classList.contains("night-mode");
    const newTheme = isNightMode ? "day" : "night";
    applyTheme(newTheme);
    // Save the new theme preference to local storage
    localStorage.setItem("theme", newTheme);
  });
  selectIbwSex("male"); // Đặt giới tính mặc định là nam
  selectIbwHeightUnit("cm"); // Đặt đơn vị chiều cao mặc định là cm
});

function showBmiCalculator() {
  const bmiSection = document.getElementById("bmi-calculator-section");
  hideAllSections();
  bmiSection.classList.remove("hidden");
  smoothScrollTo("bmi-calculator-section");
}

// --- BMI Calculator Redesign Logic ---

// Hàm xử lý chọn giới tính
function selectSex(sex) {
  document.getElementById("sex-male").classList.remove("active");
  document.getElementById("sex-female").classList.remove("active");
  document.getElementById(`sex-${sex}`).classList.add("active");
  document.getElementById("bmi-sex").value = sex; // Lưu giá trị đã chọn
}

// Hàm xử lý chọn đơn vị chiều cao
function selectHeightUnit(unit) {
  document.getElementById("unit-cm").classList.remove("active");
  document.getElementById("unit-ftin").classList.remove("active");
  document.getElementById(`unit-${unit}`).classList.add("active");
  document.getElementById("bmi-height-unit").value = unit;
  document.getElementById("height-unit-display").textContent =
    unit === "cm" ? "cm" : "ft/in";
  // Có thể thêm logic chuyển đổi giá trị input nếu cần khi đổi đơn vị
}

// Hàm xử lý chọn đơn vị cân nặng
function selectWeightUnit(unit) {
  document.getElementById("unit-kg").classList.remove("active");
  document.getElementById("unit-lb").classList.remove("active");
  document.getElementById(`unit-${unit}`).classList.add("active");
  document.getElementById("bmi-weight-unit").value = unit;
  document.getElementById("weight-unit-display").textContent =
    unit === "kg" ? "kg" : "lb";
  // Có thể thêm logic chuyển đổi giá trị input nếu cần khi đổi đơn vị
}

// Hàm tính BMI cập nhật
function calculateBmi() {
  const ageInput = document.getElementById("bmi-age");
  const heightInput = document.getElementById("bmi-height");
  const weightInput = document.getElementById("bmi-weight");
  const heightUnit = document.getElementById("bmi-height-unit").value;
  const weightUnit = document.getElementById("bmi-weight-unit").value;
  const sex = document.getElementById("bmi-sex").value; // Lấy giá trị giới tính

  const resultEl = document.getElementById("bmi-result");
  const interpretationEl = document.getElementById("bmi-interpretation");

  resultEl.innerHTML = "";
  interpretationEl.innerHTML = "";

  const age = parseInt(ageInput.value);
  let height = parseFloat(heightInput.value);
  let weight = parseFloat(weightInput.value);

  // --- Validation ---
  if (!age || age < 1 || age > 120) {
    showToast("Vui lòng nhập tuổi hợp lệ (1-120).");
    return;
  }
  if (!height || height <= 0) {
    showToast("Vui lòng nhập chiều cao hợp lệ.");
    return;
  }
  if (!weight || weight <= 0) {
    showToast("Vui lòng nhập cân nặng hợp lệ.");
    return;
  }

  // --- Unit Conversion ---
  let heightInCm = height;
  if (heightUnit === "ftin") {
    // Giả sử người dùng nhập dạng feet.inches (vd: 5.10 cho 5 feet 10 inches)
    // Hoặc cần tách thành 2 input riêng cho feet và inches để chính xác hơn
    const feet = Math.floor(height);
    const inches = (height - feet) * 100; // Lấy phần thập phân làm inches
    heightInCm = feet * 30.48 + inches * 2.54;
    // LƯU Ý: Cách xử lý input 'ftin' này là đơn giản hóa.
    // Để chính xác, nên có 2 ô nhập riêng cho feet và inches.
    if (isNaN(heightInCm) || heightInCm <= 0) {
      showToast(
        "Định dạng ft/in không hợp lệ. Ví dụ: 5.10 cho 5 feet 10 inches."
      );
      return;
    }
  }

  let weightInKg = weight;
  if (weightUnit === "lb") {
    weightInKg = weight * 0.453592;
    if (isNaN(weightInKg) || weightInKg <= 0) {
      showToast("Cân nặng (lb) không hợp lệ.");
      return;
    }
  }

  // --- Calculation ---
  if (heightInCm <= 0 || weightInKg <= 0) {
    showToast("Chiều cao và cân nặng phải lớn hơn 0.");
    return;
  }

  const heightInMeters = heightInCm / 100;
  const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);

  // --- Display Results ---
  resultEl.innerHTML = `Chỉ số BMI của bạn là: <strong>${bmi}</strong>`;

  let interpretation = "";
  let color = "";
  if (bmi < 18.5) {
    interpretation = "Bạn đang thiếu cân.";
    color = "#3498db"; // Blue
  } else if (bmi >= 18.5 && bmi < 24.9) {
    interpretation = "Bạn có cân nặng bình thường.";
    color = "#2ecc71"; // Green
  } else if (bmi >= 25 && bmi < 29.9) {
    interpretation = "Bạn đang thừa cân.";
    color = "#f39c12"; // Orange
  } else {
    // bmi >= 30
    interpretation = "Bạn đang bị béo phì.";
    color = "#e74c3c"; // Red
  }
  interpretationEl.innerHTML = `<span style="color: ${color}; font-weight: bold;">${interpretation}</span>`;
}

// Khởi tạo trạng thái active ban đầu khi trang tải (nếu cần)
document.addEventListener("DOMContentLoaded", () => {
  // Bạn có thể gọi các hàm select...() ở đây nếu muốn đặt giá trị mặc định khác
  // ví dụ: selectHeightUnit('cm'); selectWeightUnit('kg'); selectSex('male');
});

function showIbwCalculator() {
  const ibwSection = document.getElementById("ibw-calculator-section");
  hideAllSections();
  ibwSection.classList.remove("hidden");
  smoothScrollTo("ibw-calculator-section");
}

function selectIbwSex(sex) {
  document.getElementById("ibw-sex-male").classList.remove("active");
  document.getElementById("ibw-sex-female").classList.remove("active");
  document.getElementById(`ibw-sex-${sex}`).classList.add("active");
  document.getElementById("ibw-sex").value = sex; // Lưu giá trị đã chọn
}

function selectIbwHeightUnit(unit) {
  document.getElementById("ibw-unit-cm").classList.remove("active");
  document.getElementById("ibw-unit-ftin").classList.remove("active");
  document.getElementById(`ibw-unit-${unit}`).classList.add("active");
  document.getElementById("ibw-height-unit").value = unit;
  document.getElementById("ibw-height-unit-display").textContent =
    unit === "cm" ? "cm" : "ft/in";
  // Có thể thêm logic chuyển đổi giá trị input nếu cần khi đổi đơn vị
}

function calculateIbw() {
  const ageInput = document.getElementById("ibw-age");
  const heightInput = document.getElementById("ibw-height");
  const sex = document.getElementById("ibw-sex").value;
  const heightUnit = document.getElementById("ibw-height-unit").value;

  const resultEl = document.getElementById("ibw-result");
  const rangeInfoEl = document.getElementById("ibw-range-info"); // Lấy phần tử mới
  const noteEl = document.getElementById("ibw-note");

  resultEl.textContent = "";
  rangeInfoEl.textContent = ""; // Xóa nội dung cũ
  noteEl.textContent = ""; // Xóa nội dung cũ

  const age = parseInt(ageInput.value);
  let height = parseFloat(heightInput.value);

  // --- Validation ---
  if (!age || age < 1 || age > 120) {
    showToast("Vui lòng nhập tuổi hợp lệ (1-120).");
    return;
  }
  if (!height || height <= 0) {
    showToast("Vui lòng nhập chiều cao hợp lệ.");
    return;
  }
  if (!sex) {
    showToast("Vui lòng chọn giới tính.");
    return;
  }

  // --- Height Conversion to Inches ---
  let heightInInches;
  if (heightUnit === "cm") {
    heightInInches = height / 2.54;
  } else if (heightUnit === "ftin") {
    // Xử lý ft/in (ví dụ: 5.10 nghĩa là 5 feet 10 inches)
    const feet = Math.floor(height);
    const inchesComponent = Math.round((height - feet) * 100); // Lấy phần thập phân làm inches
    if (feet < 0 || inchesComponent < 0 || inchesComponent >= 12) {
      showToast("Định dạng ft/in không hợp lệ (vd: 5.10 cho 5ft 10in).");
      return;
    }
    heightInInches = feet * 12 + inchesComponent;
  } else {
    showToast("Đơn vị chiều cao không hợp lệ.");
    return;
  }

  if (isNaN(heightInInches) || heightInInches <= 0) {
    showToast("Chiều cao không hợp lệ sau khi chuyển đổi.");
    return;
  }

  // --- IBW Calculation (using Devine formula as example) ---
  // Ngưỡng chiều cao tối thiểu cho công thức (5 feet = 60 inches)
  const minHeightInches = 60;
  let ibwKg = null;

  if (heightInInches >= minHeightInches) {
    const inchesOver5Feet = heightInInches - minHeightInches;
    if (sex === "male") {
      ibwKg = 50 + 2.3 * inchesOver5Feet;
    } else if (sex === "female") {
      ibwKg = 45.5 + 2.3 * inchesOver5Feet;
    }
  } else {
    // Xử lý trường hợp chiều cao dưới 5 feet (công thức Devine không áp dụng trực tiếp)
    // Có thể dùng tỷ lệ hoặc một công thức khác, hoặc thông báo không phù hợp
    noteEl.textContent =
      "Công thức Devine thường áp dụng cho chiều cao từ 5 feet (152.4 cm) trở lên.";
    // Ví dụ: Tính toán dựa trên BMI khỏe mạnh (ví dụ: BMI 21)
    const heightInMeters = heightInInches * 0.0254;
    ibwKg = 21 * (heightInMeters * heightInMeters); // Ước tính dựa trên BMI
    // return; // Hoặc dừng lại nếu không muốn ước tính
  }

  if (ibwKg !== null && ibwKg > 0) {
    const ibwLb = ibwKg * 2.20462; // Chuyển sang pounds nếu cần
    resultEl.innerHTML = `Cân nặng lý tưởng (ước tính): <strong>${ibwKg.toFixed(
      1
    )} kg</strong> (${ibwLb.toFixed(1)} lb)`;

    // Tính khoảng cân nặng +-10% (ví dụ)
    const lowerBoundKg = ibwKg * 0.9;
    const upperBoundKg = ibwKg * 1.1;
    rangeInfoEl.textContent = `Một khoảng cân nặng tham khảo có thể là từ ${lowerBoundKg.toFixed(
      1
    )} kg đến ${upperBoundKg.toFixed(1)} kg.`;

    if (!noteEl.textContent) {
      // Chỉ thêm ghi chú nếu chưa có ghi chú về chiều cao
      noteEl.textContent =
        "Lưu ý: Đây chỉ là giá trị tham khảo dựa trên công thức Devine. Yếu tố khác như cấu trúc xương, cơ bắp có thể ảnh hưởng.";
    }
  } else if (!noteEl.textContent) {
    // Nếu ibwKg không tính được và chưa có ghi chú
    resultEl.textContent = "Không thể tính toán với thông tin đã nhập.";
  }
}
