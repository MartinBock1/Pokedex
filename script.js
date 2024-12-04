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
let loadToId = 6;
let pokemons = [];

let pokemonList = [];
let pokemon;
let pokemonIconNames = [];
let Type = [];
let pokemonAbilities = [];

/*------------------------------------------------------------ Init & Fetch Section ------------------------------------------------------------*/
async function init() {
    loadingSpinner();
    document.getElementById('search').addEventListener('input', handleSearchInput);    
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
            // console.log(pokemons.types);

            let type;
            for (let j = 0; j < pokemons.types.length; j++) {    
                let responseTypes = await fetch(pokemons.types[j].type.url);
                type = await responseTypes.json();
            }

            pokemonList.push({
                name: pokemons.name,
                id: pokemons.id,
                image: pokemons.sprites.other.home.front_default,
                types: pokemons.types,
                color: speciesDetails.color.name,
                height: pokemons.height,
                weight: pokemons.weight,
                baseExperience: pokemons.base_experience,
                abilities: pokemons.abilities,
                flavortext: speciesDetails.flavor_text_entries[0].flavor_text,
                type: type.sprites['generation-iii'].colosseum,

            });
            // console.log(pokemonList);            
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById('content').innerHTML = `Fehler: ${error.message}`;
    }
}

/*---------------------------------------------------------- Loading & Render Section ----------------------------------------------------------*/
async function loadingSpinner() {
    if (!isLoading) {
        isLoading = true;
        let loadingRef = document.getElementById('loadingSpinner');
        loadingRef.innerHTML = "";
        document.getElementById('loadingSpinner').innerHTML = loadingSpinnerTemplate();

        await fetchDataJson();
        renderPokemonData();

        isLoading = false;
        loadingRef.innerHTML = "";
    }
}

async function loadMore() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";
    loadToId = loadToId + loadToId;
    loadingSpinner();
    console.log(loadToId);
}

async function renderPokemonData() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";

    for (let i = 0; i < pokemonList.length; i++) {
        pokemon = pokemonList[i];
        // console.log(pokemon.name);

        document.getElementById('content').innerHTML += miniCardTemplate(pokemon);
        document.getElementById(`mini_card_body_${pokemon.name}`).style.backgroundColor = pokemon.color;

        pokemonIconNames = [];
        for (let j = 0; j < pokemon.types.length; j++) {
            pokemonIconNames.push(pokemon.types[j].type.name);
        }
        // console.log(pokemons.types);

        pokemonAbilities = [];
        for (let k = 0; k < pokemon.abilities.length; k++) {
            pokemonAbilities.push(pokemon.abilities[k].ability.name);
        }
        // console.log(pokemonAbilities); 

        // Add the icons for each type to the 'mini_card_icon_${pokemonName}' div
        let iconElement = document.getElementById(`mini_card_icon_${pokemon.name}`);
        for (let index = 0; index < pokemonIconNames.length; index++) {
            iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemonIconNames[index]}.png" alt="${pokemonIconNames[index]}">`;
        }
    }
}

/** Function that handles the input event
 * @filterWord : Trims any unnecessary spaces from the input and converts it to lowercase for a case-insensitive search.
 * @warningElement : Finds the warning message element to show or hide based on the input length.
 * @filterAndShowPkm : This function is called when there are at least 3 characters in the input to filter the Pokémon list.
 * @renderPokemonData : This function is called when there are fewer than 3 characters, displaying all the Pokémon again.
 * @param {*} event 
 */
function handleSearchInput(event) {
    let filterWord = event.target.value.trim().toLowerCase();               // Get the input value, trim spaces, and convert it to lowercase     
    let warningElement = document.getElementById('min-letters-warning');    // Find the element to show the warning message by its ID

    if (filterWord.length >= 3) {               // If the input length is 3 or more characters 
        filterAndShowPkm(filterWord);           // Call the function to filter and show Pokemons based on the input    
        warningElement.style.display = 'none';  // Hide the warning message (if the input is valid)
    } else {                                    // If the input length is less than 3 characters
        warningElement.style.display = 'block'; // Show the warning message        
        renderPokemonData();                    // Show all Pokémon (as no filtering is applied with less than 3 characters)
    }
}

/** Function that filters and displays Pokemon based on the input word
 * @filterAndShowPkm : This function takes the search input (filterWord) and filters the Pokemon list.
 * @filteredPokemons : Filters the pokemonList to include only those Pokémon whose names contain the filterWord .
 * @renderFilteredPokemonData : This function is called to display the filtered Pokemon on the page, based on the filtered list (filteredPokemons).
 * @param {*} filterWord 
 */
function filterAndShowPkm(filterWord) {
    // Filter the Pokémon based on their names
    let filteredPokemons = pokemonList.filter(pokemon =>    // Filter the pokemonList array
        pokemon.name.toLowerCase().includes(filterWord)     // Convert the Name to lowercase and check if it contains the filter word
    );

    // Now render only the filtered Pokemon
    renderFilteredPokemonData(filteredPokemons);            // Call a function to render the filtered Pokemon on the page    
}

/** Function to render the filtered Pokémon data
 * @renderFilteredPokemonData : This function is responsible for rendering the filtered list of Pokémon on the page.
 * @contentRef.innerHTML = "";: Clears the content area to make room for the new filtered Pokémon cards.
 * @for (let i = 0; i < filteredPokemons.length; i++): Loops through each Pokémon in the filtered list to display them one by one.
 * @contentRef.innerHTML += miniCardTemplate(pokemon);: Adds the mini card template (HTML structure for each Pokémon) to the page.
 * @document.getElementById(mini_card_body_${pokemon.name}).style.backgroundColor = pokemon.color;: Sets the background color of 
 * each Pokémon’s mini card based on its color.
 * @let iconElement = document.getElementById(mini_card_icon_${pokemon.name});: Gets the reference to the element where Pokémon type icons will be displayed.
 * @for (let index = 0; index < pokemon.types.length; index++): Loops through each of the Pokémon's types (e.g., Fire, Water, Grass).
 * @iconElement.innerHTML += <img src="...">;: Adds an image of the Pokémon type icon for each type the Pokémon has.
 * @let searchRef = document.getElementById('search');: Gets the reference to the search input field.
 * @searchRef.innerHTML = "";: Clears the search field content. (However, this line might be incorrect if you want to keep the user's search input visible; 
 * clearing the innerHTML of an input field is not appropriate. You should use searchRef.value = ""; to reset the input's value if needed.)
 * @param {*} filteredPokemons 
 */
async function renderFilteredPokemonData(filteredPokemons) {
    let contentRef = document.getElementById('content');    // Get the reference to the content area where the Pokémon will be displayed
    contentRef.innerHTML = "";                              // Clear the content before displaying the filtered Pokémon 

    for (let i = 0; i < filteredPokemons.length; i++) {     // Loop through each Pokémon in the filteredPokemons array
        let pokemon = filteredPokemons[i];                  // Get the current Pokémon object

        // Create and display the mini card for the current Pokémon
        contentRef.innerHTML += miniCardTemplate(pokemon);  // Add the mini card HTML template for the Pokémon to the content area
        document.getElementById(`mini_card_body_${pokemon.name}`)
            .style.backgroundColor = pokemon.color;         // Set the background color of the mini card based on the Pokémon's color

        let iconElement = document.getElementById(`mini_card_icon_${pokemon.name}`);    // Get the reference to the icon container in the mini card
        for (let index = 0; index < pokemon.types.length; index++) {                    // Loop through all types of the Pokémon
            // Add an image icon for each Pokémon type to the mini card's icon section
            iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemon.types[index].type.name}.png" alt="${pokemon.types[index].type.name}">`;
        }
    }
    let searchRef = document.getElementById('search');      // Get the reference to the search input field
    // searchRef.innerHTML = "";                               // Clear the search field content (NOTE: This clears the input, which may not be intended)
    searchRef.value = "";  // Clear the search field's value (this will reset the search input field)
}

/*---------------------------------------------------------- Overlay On & Off Section ----------------------------------------------------------*/
function overlayOn(pokemonName) {
    document.getElementById("overlay").style.display = "block";
    document.body.style.overflow = "hidden";

    // Find selected Pokemon in the pokemonList by name
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);
    console.log(pokemon.type);

    if (selectedPokemon) {
        // Pass the selected Pokémon to the detailCardTemplate function
        document.getElementById("overlay").innerHTML = detailCardTemplate(selectedPokemon, null, pokemonAbilities);
        // document.getElementById("detail_card_icon").innerHTML += `<img src="${pokemon.type}">`;
    }
}

function getNextPokemonName(currentName, direction) {
    let currentIndex = pokemonList.findIndex(pokemon => pokemon.name === currentName);
    // console.log(currentName);

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
    document.body.style.overflow = "auto";
}

// event bubbling
function logDownWithBubblingPrevention(event) {
    // console.log(logDown);
    event.stopPropagation();
};

/*-------------------------------------------------------- Show Pokemon Details Section --------------------------------------------------------*/
function showMainDetails(pokemonName) {
    let mainRef = document.getElementById('detail_content');
    mainRef.innerHTML = "";  
    
    // Find selected Pokemon in the pokemonList by name
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    if (selectedPokemon) {
        // Pass the selected Pokémon to the detailCardTemplate function
        document.getElementById("detail_content").innerHTML = mainDetailsTemplate(selectedPokemon, pokemonAbilities);
    }
}

function showStatsDetails(pokemonName) {
    let mainRef = document.getElementById('detail_content');
    mainRef.innerHTML = "";

    // Find selected Pokemon in the pokemonList by name
    // let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    // if (selectedPokemon) {
    //     // Pass the selected Pokémon to the detailCardTemplate function
    //     document.getElementById("detail_content").innerHTML = mainDetailsTemplate(selectedPokemon, pokemonAbilities);
    // }
}

function showEvoChainDetails(pokemonName) {
    let mainRef = document.getElementById('detail_content');
    mainRef.innerHTML = "";

    // Find selected Pokemon in the pokemonList by name
    // let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    // if (selectedPokemon) {
    //     // Pass the selected Pokémon to the detailCardTemplate function
    //     document.getElementById("detail_content").innerHTML = mainDetailsTemplate(selectedPokemon, pokemonAbilities);
    // }
}