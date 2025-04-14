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

function showCategory(category) {
  const list = document.getElementById("food-list");
  list.innerHTML = "";

  foodData[category].forEach((mon) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
        <img class="food-img" src="images/${category}/${mon.image}" alt="${mon.name}">
        <h3>${mon.name}</h3>
        <div class="food-info">
          <img class="icon" src="images/icon/ngonlua.jpg" alt="calo">
          <span>${mon.calo} kcal</span>
        </div>
        <div class="food-info">
          <img class="icon" src="images/icon/cobap.jpg" alt="protein">
          <span>${mon.protein}g protein</span>
        </div>
      `;
    list.appendChild(card);
  });
}
