document.addEventListener("DOMContentLoaded", function () {
  // Dane statyczne samochodów
  let cars = [
    {
      marca: "Toyota",
      model: "Corolla",
      rok: 2020,
      cena: 75000,
      mocSilnika: "150 KM",
      przebieg: 20000,
      obrazek: "toyota_corolla.jpg",
    },
    {
      marca: "BMW",
      model: "X5",
      rok: 2018,
      cena: 120000,
      mocSilnika: "250 KM",
      przebieg: 30000,
      obrazek: "bmw_x5.jpg",
    },
    {
      marca: "Audi",
      model: "A4",
      rok: 2019,
      cena: 90000,
      mocSilnika: "190 KM",
      przebieg: 25000,
      obrazek: "audi_a4.jpg",
    },
  ];

  // Dostępne akcesoria
  let akcesoria = [
    { id: 1, nazwa: "GPS", cena: 500 },
    { id: 2, nazwa: "System audio premium", cena: 1000 },
    { id: 3, nazwa: "Podgrzewane fotele", cena: 800 },
  ];

  // Funkcja do wczytywania danych z lokalnego magazynu przeglądarki
  function wczytajDane() {
    let dane = JSON.parse(localStorage.getItem("dane"));
    if (dane) {
      wyswietlSamochody(dane.samochody);
    } else {
      wyswietlSamochody(cars);
    }
  }

  // Funkcja do zapisywania danych do lokalnego magazynu przeglądarki
  function zapiszDane(dane) {
    localStorage.setItem("dane", JSON.stringify(dane));
  }

  // Funkcja do wyświetlania listy samochodów
  function wyswietlSamochody(listaSamochodow) {
    let listaSamochodowDiv = document.getElementById("lista-samochodow");
    listaSamochodowDiv.innerHTML = "";

    listaSamochodow.forEach(function (samochod, index) {
      let samochodDiv = document.createElement("div");
      samochodDiv.innerHTML = `
                <p>Marka: ${samochod.marca}</p>
                <p>Model: ${samochod.model}</p>
                <p>Rok produkcji: ${samochod.rok}</p>
                <p>Cena: ${samochod.cena} PLN</p>
                <p>Moc silnika: ${samochod.mocSilnika}</p>
                <p>Przebieg: ${samochod.przebieg} km</p>
                <img src="${samochod.obrazek}" alt="${samochod.model}">
            `;
      samochodDiv.addEventListener("click", function () {
        let dane = {
          samochody: listaSamochodow,
          samochod: samochod,
        };
        zapiszDane(dane);
        wyswietlFormularzKonfiguracji(samochod);
        listaSamochodowDiv.style.display = "none";
      });
      listaSamochodowDiv.appendChild(samochodDiv);
    });
  }

  // Funkcja do wyświetlania formularza konfiguracji
  function wyswietlFormularzKonfiguracji(samochod) {
    let formularzDiv = document.getElementById("formularz-konfiguracji");
    formularzDiv.innerHTML = `
            <h2>Formularz konfiguracji dla ${samochod.marca} ${
      samochod.model
    }</h2>
            <form id="formularz-zakupu">
                <label for="finansowanie">Finansowanie:</label><br>
                <input type="radio" id="leasing" name="finansowanie" value="leasing">
                <label for="leasing">Leasing</label><br>
                <input type="radio" id="gotowka" name="finansowanie" value="gotowka">
                <label for="gotowka">Gotówka</label><br><br>

                <label for="imie-nazwisko">Imię i nazwisko właściciela:</label><br>
                <input type="text" id="imie-nazwisko" name="imie-nazwisko" required><br><br>

                <label for="data-dostawy">Data dostawy:</label><br>
                <select id="data-dostawy" name="data-dostawy" required>
                    ${generujDatyDostawy()}
                </select><br><br>

                <label for="akcesoria">Wybierz akcesoria:</label><br>
                <select id="akcesoria" name="akcesoria" multiple>
                    ${generujOpcjeAkcesoriow(akcesoria)}
                </select><br><br>

                <button type="submit" id="zakup-button">Zakup</button>
            </form>
            <button id="powrot-do-wyboru">Powrót do wyboru</button>
            <div id="komunikat-bledu" style="color: red; display: none;">Wypełnij wszystkie pola formularza!</div>
            <div id="potwierdzenie-zakupu" style="color: green; display: none;">Dziękujemy za zakup samochodu ${
              samochod.marca
            } ${samochod.model}!</div>
        `;
    formularzDiv.style.display = "block";

    document
      .getElementById("powrot-do-wyboru")
      .addEventListener("click", function () {
        document.getElementById("lista-samochodow").style.display = "block";
        formularzDiv.style.display = "none";
      });

    document
      .getElementById("formularz-zakupu")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        if (walidujFormularz()) {
          zatwierdzZakup(samochod);
          document.getElementById("komunikat-bledu").style.display = "none";
          document.getElementById("potwierdzenie-zakupu").style.display =
            "block";
          document.getElementById("zakup-button").disabled = true; // Wyłączenie przycisku "Zakup"
        } else {
          document.getElementById("komunikat-bledu").style.display = "block";
          document
            .getElementById("potwierdzenie-zakupu")
            .document.getElementById("potwierdzenie-zakupu").style.display =
            "none";
        }
      });
  }

  // Funkcja generująca opcje daty dostawy
  function generujDatyDostawy() {
    let options = "";
    const dzisiaj = new Date();
    const dwaTygodniePozniej = new Date(
      dzisiaj.getTime() + 14 * 24 * 60 * 60 * 1000
    ); // Dodajemy 14 dni w milisekundach
    for (let i = 0; i < 14; i++) {
      const data = new Date(
        dwaTygodniePozniej.getTime() + i * 24 * 60 * 60 * 1000
      );
      options += `<option value="${data.toISOString().slice(0, 10)}">${data
        .toISOString()
        .slice(0, 10)}</option>`;
    }
    return options;
  }

  // Funkcja generująca opcje akcesoriów
  function generujOpcjeAkcesoriow(akcesoria) {
    let options = "";
    akcesoria.forEach(function (akcesorium) {
      options += `<option value="${akcesorium.id}">${akcesorium.nazwa} - ${akcesorium.cena} PLN</option>`;
    });
    return options;
  }

  // Funkcja walidująca formularz
  function walidujFormularz() {
    const imieNazwiskoInput = document.getElementById("imie-nazwisko");
    const dataDostawyInput = document.getElementById("data-dostawy");
    const akcesoriaInput = document.getElementById("akcesoria");

    if (
      imieNazwiskoInput.value.trim() === "" ||
      dataDostawyInput.value === ""
    ) {
      return false;
    }

    const imieNazwisko = imieNazwiskoInput.value.trim().split(" ");
    if (
      imieNazwisko.length !== 2 ||
      imieNazwisko[0] === "" ||
      imieNazwisko[1] === ""
    ) {
      return false;
    }

    return true;
  }

  // Funkcja zatwierdzająca zakup
  function zatwierdzZakup(samochod) {
    const finansowanie = document.querySelector(
      'input[name="finansowanie"]:checked'
    ).value;
    const imieNazwisko = document.getElementById("imie-nazwisko").value.trim();
    const dataDostawy = document.getElementById("data-dostawy").value;
    const akcesoriaSelect = document.getElementById("akcesoria");
    const akcesoriaWybrane = Array.from(akcesoriaSelect.selectedOptions).map(
      (option) => akcesoria.find((akc) => akc.id == option.value)
    );
    let formularzDiv = document.getElementById("formularz-konfiguracji");
    formularzDiv.innerHTML = "";
    // Obliczenie ceny samochodu
    const cenaSamochodu = samochod.cena;

    // Obliczenie ceny akcesoriów
    let cenaAkcesoriow = 0;
    akcesoriaWybrane.forEach((akcesorium) => {
      cenaAkcesoriow += akcesorium.cena;
    });

    // Obliczenie sumy całkowitej
    const sumaCeny = cenaSamochodu + cenaAkcesoriow;

    // Wyświetlenie informacji o zakupie
    const informacjeZakupuDiv = document.getElementById("informacje-zakupu");
    informacjeZakupuDiv.innerHTML = `
            <h2>Podsumowanie zakupu:</h2>
            <p>Samochód: ${samochod.marca} ${samochod.model}</p>
            <p>Finansowanie: ${finansowanie}</p>
            <p>Imię i nazwisko właściciela: ${imieNazwisko}</p>
            <p>Data dostawy: ${dataDostawy}</p>
            <p>Wybrane akcesoria:</p>
            <ul>
                ${akcesoriaWybrane
                  .map(
                    (akcesorium) =>
                      `<li>${akcesorium.nazwa} - ${akcesorium.cena} PLN</li>`
                  )
                  .join("")}
            </ul>
            <p>Całkowita cena: ${sumaCeny} PLN</p>
        `;
  }

  // Inicjalizacja aplikacji
  wczytajDane();
});
