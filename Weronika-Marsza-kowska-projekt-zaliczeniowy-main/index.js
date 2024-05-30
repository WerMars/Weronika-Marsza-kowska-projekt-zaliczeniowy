document.addEventListener("DOMContentLoaded", function () {
  // Static car data
  let cars = [
    {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      price: 75000,
      enginePower: "150 HP",
      mileage: 20000,
      image: "toyota_corolla.jpg",
    },
    {
      brand: "BMW",
      model: "X5",
      year: 2018,
      price: 120000,
      enginePower: "250 HP",
      mileage: 30000,
      image: "bmw_x5.jpg",
    },
    {
      brand: "Audi",
      model: "A4",
      year: 2019,
      price: 90000,
      enginePower: "190 HP",
      mileage: 25000,
      image: "audi_a4.jpg",
    },
  ];

  // Available accessories
  let accessories = [
    { id: 1, name: "GPS", price: 500 },
    { id: 2, name: "System audio klasy premium", price: 1000 },
    { id: 3, name: "Podgrzewane fotele", price: 800 },
  ];

  // Function to load data from local storage
  function loadData() {
    let data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      displayCars(data.cars);
    } else {
      displayCars(cars);
    }
  }

  // Function to save data to local storage
  function saveData(data) {
    localStorage.setItem("data", JSON.stringify(data));
  }

  // Function to display the list of cars
  function displayCars(carList) {
    let carListDiv = document.getElementById("car-list");
    carListDiv.innerHTML = "";

    carList.forEach(function (car, index) {
      let carDiv = document.createElement("div");
      carDiv.classList.add("car");
      if (car.brand === "Toyota") {
        carDiv.classList.add("toyota-bg");
      }
      carDiv.innerHTML = `
              <p class="car-brand"><strong>Marka:</strong> ${car.brand}</p>
              <p><strong>Model:</strong> ${car.model}</p>
              <p><strong>Rok:</strong> ${car.year}</p>
              <p><strong>Cena:</strong> ${car.price} PLN</p>
              <p><strong>Moc silnika:</strong> ${car.enginePower}</p>
              <p><strong>Przebieg:</strong> ${car.mileage} km</p>
              <img src="${car.image}" alt="${car.model}">
          `;
      carDiv.addEventListener("click", function () {
        let data = {
          cars: carList,
          car: car,
        };
        saveData(data);
        displayConfigForm(car);
        carListDiv.style.display = "none";
      });
      carListDiv.appendChild(carDiv);
    });
  }

  // Function to display the configuration form
  function displayConfigForm(car) {
    let formDiv = document.getElementById("config-form");
    formDiv.innerHTML = `
          <h2>Formularz konfiguracyjny dla ${car.brand} ${car.model}</h2>
          <form id="purchase-form">
              <label for="financing">Finansowanie:</label><br>
              <input type="radio" id="leasing" name="financing" value="leasing">
              <label for="leasing">Leasing</label><br>
              <input type="radio" id="cash" name="financing" value="cash">
              <label for="cash">Gotówka</label><br><br>

              <label for="owner-name">Imię i nazwisko:</label><br>
              <input type="text" id="owner-name" name="owner-name" required><br><br>

              <label for="delivery-date">Termin dostawy:</label><br>
              <select id="delivery-date" name="delivery-date" required>
                  ${generateDeliveryDates()}
              </select><br><br>

              <label for="accessories">Wybierz akcesoria:</label><br>
              ${generateAccessoryCheckboxes(accessories)}<br><br>

              <button type="submit" id="purchase-button">Kupuję</button>
          </form>
          <button id="return-to-selection">Powrót do wyboru</button>
          <div id="error-message" style="color: red; display: none;">Wypełnij wszystkie pola!</div>
          <div id="purchase-confirmation" style="color: green; display: none;">Dziękujemy za zakup ${
            car.brand
          } ${car.model}!</div>
      `;
    formDiv.style.display = "block";

    document
      .getElementById("return-to-selection")
      .addEventListener("click", function () {
        document.getElementById("car-list").style.display = "block";
        formDiv.style.display = "none";
      });

    document
      .getElementById("purchase-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        if (validateForm()) {
          confirmPurchase(car);
          document.getElementById("error-message").style.display = "none";
          document.getElementById("purchase-confirmation").style.display =
            "block";
          document.getElementById("purchase-button").disabled = true; // Disable purchase button
        } else {
          document.getElementById("error-message").style.display = "block";
          document
            .getElementById("purchase-confirmation")
            .document.getElementById("purchase-confirmation").style.display =
            "none";
        }
      });
  }

  // Function to generate delivery date options
  function generateDeliveryDates() {
    let options = "";
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // Add 14 days in milliseconds
    for (let i = 0; i < 14; i++) {
      const date = new Date(twoWeeksLater.getTime() + i * 24 * 60 * 60 * 1000);
      options += `<option value="${date.toISOString().slice(0, 10)}">${date
        .toISOString()
        .slice(0, 10)}</option>`;
    }
    return options;
  }

  // Function to generate accessory checkboxes
  function generateAccessoryCheckboxes(accessories) {
    let checkboxes = "";
    accessories.forEach(function (accessory) {
      checkboxes += `
              <input type="checkbox" id="accessory-${accessory.id}" name="accessories" value="${accessory.id}">
              <label for="accessory-${accessory.id}">${accessory.name} - ${accessory.price} PLN</label><br>
                `;
    });
    return checkboxes;
  }

  // Function to validate the form
  function validateForm() {
    const ownerNameInput = document.getElementById("owner-name");
    const deliveryDateInput = document.getElementById("delivery-date");
    const financingInput = document.querySelector(
      'input[name="financing"]:checked'
    );

    if (
      ownerNameInput.value.trim() === "" ||
      deliveryDateInput.value === "" ||
      !financingInput
    ) {
      return false;
    }

    const ownerName = ownerNameInput.value.trim().split(" ");
    if (ownerName.length !== 2 || ownerName[0] === "" || ownerName[1] === "") {
      document.getElementById("error-message").innerText =
        "Sprawdź wpisane dane";
      return false;
    }

    return true;
  }
  // Function to confirm the purchase
  function confirmPurchase(car) {
    const financing = document.querySelector(
      'input[name="financing"]:checked'
    ).value;
    const ownerName = document.getElementById("owner-name").value.trim();
    const deliveryDate = document.getElementById("delivery-date").value;
    const accessoriesSelect = document.getElementsByName("accessories");
    const selectedAccessories = Array.from(accessoriesSelect)
      .filter((accessory) => accessory.checked)
      .map((input) => {
        const accessoryId = parseInt(input.value);
        return accessories.find((acc) => acc.id === accessoryId);
      });

    // Calculate car price
    const carPrice = car.price;

    // Calculate accessory price
    let accessoryPrice = 0;
    selectedAccessories.forEach((accessory) => {
      accessoryPrice += accessory.price;
    });

    // Calculate total price
    const totalPrice = carPrice + accessoryPrice;

    // Display purchase summary
    const purchaseInfoDiv = document.getElementById("purchase-info");
    const carDetailsDiv = document.createElement("div");
    const accessoryDetailsDiv = document.createElement("div");
    const totalPriceDiv = document.createElement("div");
    const carImage = document.createElement("img");
    const returnButton = document.createElement("button");

    carDetailsDiv.innerHTML = `
                <h2>Podsumowanie zakupów:</h2>
                <p>Imię i nazwisko kupującego: ${ownerName} </p>
                <p>Samochód: ${car.brand} ${car.model}</p>
                <p>Rok: ${car.year}</p>
                <p>Cena: ${car.price} PLN</p>
            `;

    accessoryDetailsDiv.innerHTML = "<p>Wybrane akcesoria:</p><ul>";
    selectedAccessories.forEach((accessory) => {
      accessoryDetailsDiv.innerHTML += `<li>${accessory.name} - ${accessory.price} PLN</li>`;
    });
    accessoryDetailsDiv.innerHTML += "</ul>";

    totalPriceDiv.innerHTML = `<p>Cena całkowita: ${totalPrice} PLN</p>`;

    // Set image source and alt attributes
    carImage.src = car.image;
    carImage.alt = `${car.brand} ${car.model} Image`;

    // Set return button properties
    returnButton.textContent = "Powrót do sklepu";
    returnButton.addEventListener("click", function () {
      document.getElementById("car-list").style.display = "block";
      purchaseInfoDiv.style.display = "none";
    });

    purchaseInfoDiv.innerHTML = ""; // Clear purchase info div
    purchaseInfoDiv.appendChild(carImage); // Append image to purchase info
    purchaseInfoDiv.appendChild(carDetailsDiv); // Append car details to purchase info
    purchaseInfoDiv.appendChild(accessoryDetailsDiv); // Append accessory details to purchase info
    purchaseInfoDiv.appendChild(totalPriceDiv); // Append total price to purchase info
    purchaseInfoDiv.appendChild(returnButton); // Append return button to purchase info

    purchaseInfoDiv.style.display = "block";
  }

  // Initialize application
  loadData();
});
