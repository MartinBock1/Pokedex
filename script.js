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

let isLoading = false;
let loadToId = 5;
let pokemons = [];
// let pokemonData = [];
// let pokemonImage = [];
// let pokemonColor;

let pokemonList = [];
let pokemon;
let pokemonIconNames = [];

async function init() {
    loadingSpinner();
}

async function loadMore() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";
    loadToId = loadToId + loadToId;
    loadingSpinner();
    console.log(loadToId);
}

async function loadingSpinner() {
    if (!isLoading) {
        isLoading = true;
        let loadingRef = document.getElementById('loadingSpinner');
        loadingRef.innerHTML = "";
        document.getElementById('loadingSpinner').innerHTML = progressCircleTemplate();

        await fetchDataJson();
        let contentRef = document.getElementById('content');
        contentRef.innerHTML = "";
        renderPokemonData();

        isLoading = false;
        loadingRef.innerHTML = "";
    }
}

async function fetchDataJson() {
    try {
        let responseAPI = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${loadToId}&offset=0`);
        let responseApiAsJson = await responseAPI.json();   // get responseApiAsJson for each loaded pokemon (e.g. results[])
        pokemonList = []; // clear pokemonList and fill again
        for (let i = 0; i < responseApiAsJson.results.length; i++) {
            let pokemonData = responseApiAsJson.results[i]; // get name % url of each loaded pokemon
            // console.log(pokemonData);

            /** get firstleveldetails for each pokemon
             * e.g. id, names, species, sprites for images, types(e.g. grass, poison), weight
             */
            let firstLevelDetailsApi = await fetch(pokemonData.url);
            pokemons = await firstLevelDetailsApi.json();
            // console.log(pokemons);

            let responseSpecies = await fetch(pokemons.species.url);
            let speciesDetails = await responseSpecies.json();
            // console.log(speciesDetails);
            
            pokemonList.push({
                name: pokemons.name,
                id: pokemons.id,
                image: pokemons.sprites.other.home.front_default,
                types: pokemons.types,
                color: speciesDetails.color.name,
            });
            // console.log(pokemonList);            
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById('content').innerHTML = `Fehler: ${error.message}`;
    }
}

async function renderPokemonData() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";

    for (let i = 0; i < pokemonList.length; i++) {
        pokemon = pokemonList[i];
        // console.log(pokemonList);

        document.getElementById('content').innerHTML += miniCardTemplate(pokemon);
        document.getElementById(`mini_card_body_${pokemon.name}`).style.backgroundColor = pokemon.color;

        pokemonIconNames = [];
        for (let j = 0; j < pokemon.types.length; j++) {
            pokemonIconNames.push(pokemon.types[j].type.name);
        }
        // console.log(pokemons.types);

        // Add the icons for each type to the 'mini_card_icon_${pokemonName}' div
        let iconElement = document.getElementById(`mini_card_icon_${pokemon.name}`);
        for (let index = 0; index < pokemonIconNames.length; index++) {
            iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemonIconNames[index]}.png" alt="${pokemonIconNames[index]}">`;
        }
    }
}

function overlayOn(pokemonName) {
    document.getElementById("overlay").style.display = "block";
    // document.getElementById("overlay").innerHTML = detailCardTemplate(pokemon);

    // Find selected Pokemon in the pokemonList by name
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    if (selectedPokemon) {
        // Pass the selected Pokémon to the detailCardTemplate function
        document.getElementById("overlay").innerHTML = detailCardTemplate(selectedPokemon);
    }
}

function getNextPokemonName(currentName, direction) {
    let currentIndex = pokemonList.findIndex(pokemon => pokemon.name === currentName);

    if (currentIndex === -1) {
        return null;  // Pokémon nicht gefunden
    }

    let nextIndex = currentIndex + direction;

    // Wenn das Pokémon am Anfang oder Ende des Arrays ist, gehe zum anderen Ende (Zirkular)
    if (nextIndex < 0) {
        nextIndex = pokemonList.length - 1;  // Gehe zum letzten Pokémon
    } else if (nextIndex >= pokemonList.length) {
        nextIndex = 0;  // Gehe zum ersten Pokémon
    }

    return pokemonList[nextIndex].name;
}


function overlayOff() {
    document.getElementById("overlay").style.display = "none";
}

// event bubbling
function logDownWithBubblingPrevention(event) {
    // console.log(logDown);
    event.stopPropagation();
};