/** TODO
 * bestimmte Anzahl an Pokemon Karten direkt rendern                                            - checked
 * Button, um weitere 20-40 Pokemon zu laden                                                    - checked
 * Loadingscreen                                                                                - checked
 * Button kann während des Ladens nicht erneut angeklickt werden                                - checked
 * 
 * Sichtbar auf kleinen Pokemon Karte:
 *  -  Name / Typ / Bild des Pokemons / Hintergrundfarbe passend zum Typ / ID (optional)        - checked
 * Hover-Effekt auf der kleinen Pokemon Karte:                                                  - checked
 *  - cursor-pointer                                                                            - checked
 * z.B. Pokemon erscheint größer etc. (optional)
 * 
 * 
 * Große Ansicht:
 * Beim Klicken auf die Pokemonkarte soll sich diese in groß öffnen.                            - checked
 * Benutze ein transparentes Overlay                                                            - checked
 * Der Hintergrund ist nicht scrollbar in der großen Ansicht.                                   - checked
 * gewisse Werte wie z.B. hp/ attack/ defense etc anzeigen                                      - checked
 * Pfeile oder ähnliches, um zwischen den Karten in der großen Ansicht zu wechseln              - checked
 * 
 * Code:
 * Aussagekräftige Namen für Funktionen und Variablen                                           - checked
 * camelCase für die Benennung / class: '-', id: '_'                                            - checked
 * Code ist formatiert                                                                          - checked
 * Höchstens 14 Zeilen pro Funktion                                                             - ???
 * Gleicher Abstand zwischen Funktionen (1 oder 2 Leerzeilen) *                                 - checked
 * Lagere HTML Templates aus in extra-Funktionen                                                - checked
 * 
 * Responsive:
 * Bis 320px Breite alles responsive ohne Scrollbalken                                          - checked
 * Content-Begrenzung für große Monitore (max-width z.B. bei 1920px oder 1440px)                - checked
 * 
 * Sonstiges:
 * Favicon                                                                                      - checked
 * Dokumenten Titel                                                                             - checked
 * Header mit: 
 *  - Logo                                                                                      - checked
 *  - Titel                                                                                     - checked
 *  - Suchleiste (man soll mindestens 3 Buchstaben)                                             - checked
 * Footer                                                                                       - checked
 */

let isLoading = false;
let loadToId = 20;

let pokemons = [];
let pokemonList = [];
let pokemon;
let pokemonIconNames = [];
let Type = [];
let pokemonAbilities = [];
let pokemonStats = [];

/*------------------------------------------------------------ Init & Fetch Section ------------------------------------------------------------*/
async function init() {
    loadingSpinner();   // Call the loadingSpinner function to show a loading indicator

    // Add an event listener to the 'search' input element that listens for user input
    // When the input changes, it will trigger the handleSearchInput function
    document.getElementById('search').addEventListener('input', handleSearchInput);
    document.getElementById("myButton").disabled = false;   // enable the loadMore button 
}

/** Define an asynchronous function to fetch and process data from the Pokemon API
 * 
 */
async function fetchDataJson() {
    try {
        let fetchPkm = `https://pokeapi.co/api/v2/pokemon?limit=${loadToId}&offset=0`;
        let responseAPI = await fetch(fetchPkm);                        // Fetch data from the Pokemon API, with a dynamic limit and offset based on 'loadToId'
        let responseApiAsJson = await responseAPI.json();               // get a JSON for each loaded pokemon (e.g. results[])
        pokemonList = [];                                               // Clear the pokemonList before refilling it with new data

        // Loop through each Pokemon in the results array
        for (let i = 0; i < responseApiAsJson.results.length; i++) {
            let pokemonData = responseApiAsJson.results[i];             // get name % url of each loaded Pokemon

            /** get firstleveldetails for each pokemon
             * e.g. id, names, species, sprites for images, types(e.g. grass, poison), weight
             */
            let firstLevelDetailsApi = await fetch(pokemonData.url);    // Fetch detailed data using the Pokemon's URL
            pokemons = await firstLevelDetailsApi.json();               // Parse the Pokemon's data
            // console.log(pokemons);

            let responseSpecies = await fetch(pokemons.species.url);    // Fetch species details for the Pokémon (e.g., color, flavor text)
            let speciesDetails = await responseSpecies.json();          // Parse the species data

            let responseEvolution = await fetch(speciesDetails.evolution_chain.url);    // Fetch species details for the Pokémon (e.g., color, flavor text)
            let evolutionChainDetails = await responseEvolution.json();                 // Parse the species data                       

            getPkmList(speciesDetails, evolutionChainDetails);
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);         // If there is an error during the API request or data processing, catch the error
        document.getElementById('content').innerHTML = `Fehler: ${error.message}`;      // Display the error message to the user on the webpage
    }
}

function getPkmList(speciesDetails, evolutionChainDetails) {
    // Push the gathered data into the pokemonList array
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
        flavortext: speciesDetails.flavor_text_entries[10].flavor_text,
        habitat: speciesDetails.habitat,
        shape: speciesDetails.shape,
        evolutionChain: evolutionChainDetails.chain,
        stats: pokemons.stats,

    });
    // console.log(pokemonList);
}

/*---------------------------------------------------------- Loading & Render Section ----------------------------------------------------------*/
/** Function controls the display of a loading spinner during data fetching.
 * It ensures that the page only loads one set of data at a time by checking and setting the isLoading variable. 
 * Once the data is fetched and rendered, the spinner is hidden, and the page is updated with the new content. 
 * This prevents users from triggering multiple loading processes simultaneously and provides a smooth experience 
 * during asynchronous data loading.
 */
async function loadingSpinner() {
    if (!isLoading) {                                               // Check if loading is not already in progress
        isLoading = true;                                           // Set isLoading to true to indicate that loading is now in progress
        let loadingRef = document.getElementById('loadingSpinner'); // Get the reference to the element with the ID 'loadingSpinner'
        loadingRef.innerHTML = "";                                  // Clear any existing content inside the loading spinner element

        // Set the content of the loading spinner element to a new loading spinner template
        document.getElementById('loadingSpinner').innerHTML = loadingSpinnerTemplate();

        await fetchDataJson();                                      // Wait for the data to be fetched asynchronously (likely from an API or server)
        renderPokemonData();                                        // After data is fetched, render the Pokemon data to the page
        document.getElementById("myButton").disabled = false;       // enable the loadMore button 

        isLoading = false;                                          // Set isLoading to false to indicate that loading is complete
        loadingRef.innerHTML = "";                                  // Clear the content of the loading spinner element to hide it
    }
}

/** Function is ltriggered when a user wants to load more content (such as when clicking a button).
 * clears the current content displayed on the page, 
 * doubles a variable (loadToId) that tracks how much content is loaded, 
 * displays a loading spinner, and logs the updated loadToId for debugging.
 */
async function loadMore() {
    let contentRef = document.getElementById('content');    // Get the reference to the content container in the HTML
    contentRef.innerHTML = "";                              // Clear the existing content inside the content container
    loadToId = loadToId + loadToId;                         // Double the value of loadToId (possibly to load more items in increments)
    loadingSpinner();                                       // Call the loadingSpinner function to show a loading animation
    console.log(loadToId);                                  // Log the current value of loadToId to the console for debugging
    document.getElementById("myButton").disabled = true;    // disable the loadMore button 
}

/** Function renders a list of Pokemon in a specified format on a webpage
 * Loops through each Pokemon in pokemonList.
 * Dynamically generates and adds a "mini card" for each Pokemon to the webpage.
 * The background color of each mini card is set based on the Pokemon's color.
 * The type icons are loaded from image files and added to each Pokemon's mini card.
 */
async function renderPokemonData() {
    let contentRef = document.getElementById('content');    // Get the reference to the content container in the HTML
    contentRef.innerHTML = "";                              // Clear the existing content in the container

    for (let i = 0; i < pokemonList.length; i++) {          // Loop through each Pokemon in the pokemonList
        pokemon = pokemonList[i];                           // Get the current Pokemon object 

        document.getElementById('content').innerHTML += miniCardTemplate(pokemon);  // Add the mini card template for the current Pokemon

        // Set the background color of the mini card based on the Pokemon's color
        document.getElementById(`mini_card_body_${pokemon.name}`).style.backgroundColor = pokemon.color;

        pokemonAbilities = [];                                          // Initialize an empty array to store the abilities of the Pokemon
        for (let k = 0; k < pokemon.abilities.length; k++) {            // Loop through the abilities of the current Pokemon
            pokemonAbilities.push(pokemon.abilities[k].ability.name);   // Push each ability.name into the pokemonAbilities array (to display in main)
        }

        pokemonStats = [];                                              // Initialize an empty array to store the stats of the Pokemon
        for (let l = 0; l < pokemon.stats.length; l++) {                // Loop through the stats of the current Pokemon
            pokemonStats.push(pokemon.stats[l]);                        // Push each stat object into the pokemonStats array (to display in stats)
        }


        // Initialize an array to hold the Pokemon's type icon names;
        let pokemonIconNames = [];                                      // Initialize an array to hold the type icon names of the Pokemon
        for (let j = 0; j < pokemon.types.length; j++) {                // Loop through the types of the current Pokemon
            pokemonIconNames.push(pokemon.types[j].type.name);          // Push each type name into the pokemonIconNames array (to display icons)
        }

        let iconElement = document.getElementById(`mini_card_icon_${pokemon.name}`);    // Get the reference to the element where type icons will be inserted
        for (let index = 0; index < pokemonIconNames.length; index++) {                 // Loop through the type icon names of the current Pokemon

            // For each type, add the appropriate type icon image to the IconElement
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

    renderFilteredPokemonData(filteredPokemons);            //  render only the filtered Pokemon
}

/** Function to render the filtered Pokemon data
 * @param {*} filteredPokemons 
 */
async function renderFilteredPokemonData(filteredPokemons) {
    let contentRef = document.getElementById('content');    // Get the reference to the content area where the Pokémon will be displayed
    contentRef.innerHTML = "";                              // Clear the content before displaying the filtered Pokémon 

    for (let i = 0; i < filteredPokemons.length; i++) {     // Loop through each Pokémon in the filteredPokemons array
        let pokemon = filteredPokemons[i];                  // Get the current Pokémon object

        // Create and display the mini card for the current Pokémon
        contentRef.innerHTML += miniCardTemplate(pokemon);  // Add the mini card HTML template for the Pokémon to the content area

        // Set the background color of the mini card based on the Pokémon's color
        document.getElementById(`mini_card_body_${pokemon.name}`).style.backgroundColor = pokemon.color;

        let iconElement = document.getElementById(`mini_card_icon_${pokemon.name}`);    // Get the reference to the icon container in the mini card
        for (let index = 0; index < pokemon.types.length; index++) {                    // Loop through all types of the Pokémon
            // Add an image icon for each Pokémon type to the mini card's icon section
            iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemon.types[index].type.name}.png" alt="${pokemon.types[index].type.name}">`;
        }
    }
}

/*---------------------------------------------------------- Overlay On & Off Section ----------------------------------------------------------*/
/** Function which takes a pokemonName as a parameter
 * 
 * @param {*} pokemonName 
 */
function overlayOn(pokemonName) {
    document.getElementById("overlay").style.display = "block";     // Set the display of the overlay element to "block" to make it visible
    document.body.style.overflow = "hidden";                        // Disable scrolling on the body by setting the overflow style to "hidden"

    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName); // Find selected Pokemon in the pokemonList by name

    // Check if the selected Pokémon was found
    if (selectedPokemon) {
        pokemonIconNames = []; // Initialize the variable inside the function to store the types of the selected Pokémon
        for (let index = 0; index < selectedPokemon.types.length; index++) {
            pokemonIconNames.push(selectedPokemon.types[index].type.name);  // Push each Pokemon type name into the pokemonIconNames array
        }

        // Set the innerHTML of the overlay to the result of the detailCardTemplate function
        // Pass the selected Pokemon and pokemonAbilities to the function
        document.getElementById("overlay").innerHTML = detailCardTemplate(selectedPokemon, pokemonAbilities);

        // Set the background color of the detail card element with the id `detail_card_body_${selectedPokemon.name}`
        // This applies the Pokemon's color to the background
        document.getElementById(`detail_card_body_${selectedPokemon.name}`).style.backgroundColor = selectedPokemon.color;

        // Loop through the pokemonIconNames array to display the type icons for the selected Pokemon
        // This will dynamically add the type icons to the "detail_card_icon" div
        for (let index = 0; index < pokemonIconNames.length; index++) {
            document.getElementById('detail_card_icon').innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemonIconNames[index]}.png" alt="${pokemonIconNames[index]}" title="${pokemonIconNames[index]}">`;
        }
    }
}

/** function which takes currentName and direction as parameters
 * 
 * @param {*} currentName 
 * @param {*} direction 
 * @returns 
 */
function getNextPokemonName(currentName, direction) {
    // Find the index of the current Pokemon in the pokemonList by matching its name with currentName
    let currentIndex = pokemonList.findIndex(pokemon => pokemon.name === currentName);

    if (currentIndex === -1) {                      // If the currentName is not found in the list, return null
        return null;
    }

    let nextIndex = currentIndex + direction;       // Calculate the nextIndex by adding the direction (positive or negative) to the currentIndex

    if (nextIndex < 0) {                            // If the nextIndex is less than 0, wrap around to the last element in the list
        nextIndex = pokemonList.length - 1;
    } else if (nextIndex >= pokemonList.length) {   // If the nextIndex is greater than or equal to the length of the list, wrap around to the first element
        nextIndex = 0;
    }

    return pokemonList[nextIndex].name;             // Return the name of the Pokemon at the calculated nextIndex
}

/** Define the function overlayOff
 * 
 */
function overlayOff() {
    document.getElementById("overlay").style.display = "none";  // Set the display style of the element with the ID "overlay" to "none", hide it
    document.body.style.overflow = "auto";                      // Restore the body's overflow style to "auto", allowing scrolling again
}

/** Define the function logDownWithBubblingPrevention that takes an event as a parameter
 * 
 * @param {*} event 
 */
function logDownWithBubblingPrevention(event) {
    event.stopPropagation();    // Stop the event from propagating (bubbling up) to parent elements
};

/*-------------------------------------------------------- Show Pokemon Details Section --------------------------------------------------------*/
function showMainDetails(pokemonName) {
    clearMainRef();

    // Find selected Pokemon in the pokemonList by name
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    if (selectedPokemon) {
        // Pass the selected Pokémon to the detailCardTemplate function
        document.getElementById("detail_content").innerHTML = mainDetailsTemplate(selectedPokemon, pokemonAbilities);
    }
}

function showStatsDetails(pokemonName) {
    clearMainRef();

    // Find selected Pokemon in the pokemonList by name
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    if (selectedPokemon) {
        // Pass the selected Pokemon to the detailCardTemplate function
        document.getElementById("detail_content").innerHTML = statsTemplate(selectedPokemon);
    }
    console.log(selectedPokemon.stats[0].base_stat);
}

function showEvoChainDetails(pokemonName) {
    clearMainRef();

    // Find selected Pokemon in the pokemonList by name
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    if (selectedPokemon) {
        // Pass the selected Pokémon to the detailCardTemplate function
        document.getElementById("detail_content").innerHTML = evoChainTemplate(selectedPokemon, pokemonAbilities);
    }
}

function clearMainRef() {
    let mainRef = document.getElementById('detail_content');    // Get the element with the ID 'detail_content' to display the details
    mainRef.innerHTML = "";                                     // Clear the current content inside 'detail_content' to prepare for new data
}