/** TODO
 * bestimmte Anzahl an Pokemon Karten direkt rendern
 * Button, um weitere 20-40 Pokemon zu laden
 * Loadingscreen 
 * Button kann während des Ladens nicht erneut angeklickt werden
 * 
 * Sichtbar auf kleinen Pokemon Karte:
 *  -  Name / Typ / Bild des Pokemons / Hintergrundfarbe passend zum Typ / ID (optional)
 * Hover-Effekt auf der kleinen Pokemon Karte:
 *  - cursor-pointer
 * z.B. Pokemon erscheint größer etc. (optional)
 * 
 * 
 * Große Ansicht:
 * Beim Klicken auf die Pokemonkarte soll sich diese in groß öffnen.
 * Benutze ein transparentes Overlay
 * Der Hintergrund ist nicht scrollbar in der großen Ansicht.
 * gewisse Werte wie z.B. hp/ attack/ defense etc anzeigen
 * Pfeile oder ähnliches, um zwischen den Karten in der großen Ansicht zu wechseln
 */


let loadToId = 5;
let isLoading = false;   // ladeanimation


async function init() {
    // loadingSpinner();
    fetchDataJson();

    // Once the data is rendered, set loading to false
    isLoading = false;

}

function loadMore() {
    loadToId = loadToId + loadToId;
    // loadingSpinner();
    fetchDataJson();
    console.log(loadToId);
}

function loadingSpinner() {
    // // Check if the loading process is not already active
    // if (!isLoading) {
    //     // Set the loading status to true to prevent the animation from starting multiple times
    //     isLoading = true;

    //     // Get a reference to the content container where the loading animation will be displayed
    //     let contentRef = document.getElementById('content');

    //     // Clear the current content in the container
    //     contentRef.innerHTML = "";

    //     // Insert the loading animation into the container
    //     document.getElementById('content').innerHTML = progressCircleTemplate();

    //     // Once the data is rendered, set loading to false
    //     // isLoading = false;     
    // }
}

async function fetchDataJson() {
    try {
        // Fetch the Pokémon list from the API
        let responseAPI = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${loadToId}&offset=0`);
        let responseApiAsJson = await responseAPI.json();   // Get the list of Pokémon (name, url)

        // Pass the data to the process function
        processPokemonData(responseApiAsJson.results);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById('content').innerHTML = `Fehler: ${error.message}`;
    }
}

async function processPokemonData(pokemonDataArray) {
    // Get a reference to the content container where the loading animation will be displayed
    let contentRef = document.getElementById('content');

    // Clear the current content in the container
    contentRef.innerHTML = "";

    for (let i = 0; i < pokemonDataArray.length; i++) {
        let pokemonData = pokemonDataArray[i];

        try {
            // Fetch the first-level details for each Pokémon (id, name, types, etc.)
            let firstLevelDetailsApi = await fetch(pokemonData.url);
            let firstLevelDetails = await firstLevelDetailsApi.json();

            // Get the Pokémon image and types
            let pokemonImage = firstLevelDetails.sprites.other.home.front_default;
            let pokemonIconNames = firstLevelDetails.types.map(typeInfo => typeInfo.type.name);

            // Fetch additional species details (e.g. color)
            let responseSpecies = await fetch(firstLevelDetails.species.url);
            let speciesDetails = await responseSpecies.json();

            // Call the render function to display the data
            renderPokemonData(firstLevelDetails, pokemonImage, pokemonIconNames, speciesDetails.color.name);
        } catch (error) {
            console.error("Fehler beim Verarbeiten der Pokémon-Daten:", error);
        }
    }
}

function renderPokemonData(firstLevelDetails, pokemonImage, pokemonIconNames, color) {
    // Insert the mini card HTML into the 'content' element
    document.getElementById('content').innerHTML += miniCardTemplate(firstLevelDetails, pokemonImage);

    // Set the background color of the Pokémon card
    document.getElementById(`mini_card_body_${firstLevelDetails.name}`).style.backgroundColor = color;

    // Add the icons for each type to the 'mini_card_icon_${pokemonName}' div
    let iconElement = document.getElementById(`mini_card_icon_${firstLevelDetails.name}`);
    for (let i = 0; i < pokemonIconNames.length; i++) {
        iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemonIconNames[i]}.png" alt="${pokemonIconNames[i]}">`;
    }
}

function on() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlay").innerHTML = detailCardTemplate();
}

function off() {
    document.getElementById("overlay").style.display = "none";
}