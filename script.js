let isLoading = false;
let loadToId = 20;

let pokemons = [];
let pokemonList = [];
let pokemon;
let pokemonIconNames = [];
let Type = [];
let pokemonAbilities = [];
let pokemonStats = [];

let year = new Date().getFullYear();
document.getElementById('year').textContent = year;

/*------------------------------------------------------------ Init & Fetch Section ------------------------------------------------------------*/
/**
 * Initialize the application by setting up event listeners and showing the loading spinner.
 */
async function init() {
    loadingSpinner();
    document.getElementById('search').addEventListener('input', handleSearchInput);
    document.getElementById("myButton").disabled = false;
}

/**
 * Fetch data from the Pokémon API and load the Pokémon list.
 */
async function fetchDataJson() {
    try {
        let fetchPkm = `https://pokeapi.co/api/v2/pokemon?limit=${loadToId}&offset=0`;
        let responseAPI = await fetch(fetchPkm);
        let responseApiAsJson = await responseAPI.json();

        for (let i = pokemonList.length; i < responseApiAsJson.results.length; i++) {
            let pokemonData = responseApiAsJson.results[i];
            /** 
             * get firstleveldetails for each pokemon
             * e.g. id, names, species, sprites for images, types(e.g. grass, poison), weight
             */
            let firstLevelDetailsApi = await fetch(pokemonData.url);
            let pokemonDetails = await firstLevelDetailsApi.json();

            let responseSpecies = await fetch(pokemonDetails.species.url);
            let speciesDetails = await responseSpecies.json();

            let responseEvolution = await fetch(speciesDetails.evolution_chain.url);
            let evolutionChainDetails = await responseEvolution.json();                      

            getPkmList(speciesDetails, evolutionChainDetails, pokemonDetails);
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById('content').innerHTML = `Fehler: ${error.message}`;
    }
}

/**
 * Adds detailed Pokémon data to the list if the Pokémon isn't already in the list.
 * @param {Object} speciesDetails - The details about the Pokémon's species.
 * @param {Object} evolutionChainDetails - The details about the Pokémon's evolution chain.
 * @param {Object} pokemonDetails - The detailed data about the Pokémon.
 */
function getPkmList(speciesDetails, evolutionChainDetails, pokemonDetails) {
    // just push, if Pokemon is not in the list
    if (!pokemonList.some(p => p.name === pokemonDetails.name)) {
        pokemonList.push({
            name: pokemonDetails.name,
            id: pokemonDetails.id,
            image: pokemonDetails.sprites.other.home.front_default,
            types: pokemonDetails.types,
            color: speciesDetails.color.name,
            height: pokemonDetails.height,
            weight: pokemonDetails.weight,
            baseExperience: pokemonDetails.base_experience,
            abilities: pokemonDetails.abilities,
            flavortext: speciesDetails.flavor_text_entries[10].flavor_text,
            habitat: speciesDetails.habitat,
            shape: speciesDetails.shape,
            evolutionChain: evolutionChainDetails.chain,
            stats: pokemonDetails.stats,
        });
    }
}

/*---------------------------------------------------------- Loading & Render Section ----------------------------------------------------------*/
/**
 * Shows a loading spinner while data is being fetched and then renders the Pokémon data.
 */
async function loadingSpinner() {
    if (!isLoading) {
        isLoading = true;

        let loadingRef = document.getElementById('loadingSpinner');
        let contentRef = document.getElementById('content');

        contentRef.style.display = 'none';
        loadingRef.style.display = 'block';        
        document.getElementById('loadingSpinner').innerHTML = loadingSpinnerTemplate();

        await fetchDataJson();
        renderPokemonData();
        document.getElementById("myButton").disabled = false;

        isLoading = false; 
        loadingRef.style.display = 'none';
        contentRef.style.display = 'flex';    
    }
}

/**
 * Loads more Pokémon data and appends it to the page.
 */
async function loadMore() {

    let contentRef = document.getElementById('content');
    let loadingRef = document.getElementById('loadingSpinner');

    contentRef.style.display = 'none';
    loadingRef.style.display = 'block';
    loadToId += 20;
    document.getElementById("myButton").disabled = true;
    await loadingSpinner();
    let loadMoreButton = document.getElementById('myButton');
    if (loadMoreButton) {
        loadMoreButton.scrollIntoView({
            behavior: 'smooth',
        });
    }
}

/**
 * Renders the Pokémon data on the page.
 */
async function renderPokemonData() {
    let contentRef = document.getElementById('content');
    let loadingRef = document.getElementById('loadingSpinner');
    contentRef.classList.remove('d_none');
    loadingRef.classList.add('d_none'); 
    
    for (let i = loadToId - 20; i < pokemonList.length; i++) {
        pokemon = pokemonList[i];
        contentRef.innerHTML += miniCardTemplate(pokemon);           
        document.getElementById(`mini_card_body_${pokemon.name}`).style.backgroundColor = pokemon.color;

        getStats(pokemon);
        getIconNames(pokemon);
    }
}

/**
 * Extracts the stats of the Pokémon.
 * @param {Object} pokemon - The Pokémon whose stats are to be extracted.
 */
function getStats(pokemon) {
    pokemonStats = [];
    for (let l = 0; l < pokemon.stats.length; l++) {
        pokemonStats.push(pokemon.stats[l]);
    }
}

/**
 * Extracts and displays the icon names for the Pokémon types.
 * @param {Object} pokemon - The Pokémon whose type icons are to be displayed.
 */
function getIconNames(pokemon) {
    let pokemonIconNames = [];
    for (let j = 0; j < pokemon.types.length; j++) {
        pokemonIconNames.push(pokemon.types[j].type.name);
    }
    let iconElement = document.getElementById(`mini_card_icon_${pokemon.name}`);
    iconElement.innerHTML = '';
    for (let index = 0; index < pokemonIconNames.length; index++) {
        iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemonIconNames[index]}.png" alt="${pokemonIconNames[index]}">`;
    }
}

/**
 * Handles the search input, filters Pokémon by name, and displays the filtered results.
 * @param {Event} event - The input event triggered by the user.
 */
function handleSearchInput(event) {
    let filterWord = event.target.value.trim().toLowerCase();
    let warningElement = document.getElementById('min-letters-warning');

    if (filterWord.length >= 3) {
        filterAndShowPkm(filterWord);
        warningElement.style.display = 'none';
    } else {
        warningElement.style.display = 'block';   
        renderPokemonData();
    }
}

/**
 * Filters the Pokémon list by name and displays the matching Pokémon.
 * @param {string} filterWord - The word used to filter Pokémon names.
 */
function filterAndShowPkm(filterWord) {
    let filteredPokemons = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(filterWord)
    );

    if (filteredPokemons.length === 0) {    
        let contentRef = document.getElementById('content');
        contentRef.innerHTML = '<div class="error-Message">No Pokemon found matching your search criteria. Please try again.</div>';
    } else {
        renderFilteredPokemonData(filteredPokemons);
    }
}

/**
 * Renders the filtered Pokémon data based on the search input.
 * @param {Array} filteredPokemons - The list of Pokémon that match the search criteria.
 */
async function renderFilteredPokemonData(filteredPokemons) {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";

    for (let i = 0; i < filteredPokemons.length; i++) {
        let pokemon = filteredPokemons[i];
        contentRef.innerHTML += miniCardTemplate(pokemon);
        document.getElementById(`mini_card_body_${pokemon.name}`).style.backgroundColor = pokemon.color;

        let iconElement = document.getElementById(`mini_card_icon_${pokemon.name}`);
        for (let index = 0; index < pokemon.types.length; index++) {
            iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemon.types[index].type.name}.png" alt="${pokemon.types[index].type.name}">`;
        }
    }
}

/*---------------------------------------------------------- Overlay On & Off Section ----------------------------------------------------------*/
/**
 * Turns on the overlay to show detailed information about a Pokémon.
 * @param {string} pokemonName - The name of the Pokémon to show details for.
 */
function overlayOn(pokemonName) {
    document.getElementById("overlay").style.display = "block";
    document.body.style.overflow = "hidden";

    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);
    if (selectedPokemon) {
        getPkmAbilities(selectedPokemon);
        document.getElementById(`detail_card_body_${selectedPokemon.name}`).style.backgroundColor = selectedPokemon.color;
        getPkmIconNames(selectedPokemon);
    }
}

/**
 * This function generates and appends HTML image elements for each type of the selected Pokémon to display their type icons.
 * It iterates over the Pokémon's types and adds an image for each type using its name.
 *
 * @param {Object} selectedPokemon - The Pokémon whose type icons will be displayed.
 * @param {Array} selectedPokemon.types - An array of type objects for the selected Pokémon, where each type contains a `type.name`.
 * @returns {void}
 * 
 * @example
 * // Given a selected Pokémon object with types like ['grass', 'poison'], this function will append the respective icons.
 * getPkmIconNames(selectedPokemon);
 */
function getPkmIconNames(selectedPokemon) {
    let pokemonIconNames = [];
    for (let index = 0; index < selectedPokemon.types.length; index++) {
        pokemonIconNames.push(selectedPokemon.types[index].type.name);
    }

    for (let index = 0; index < pokemonIconNames.length; index++) {
        document.getElementById('detail_card_icon').innerHTML += `<img src="./img/pokedex_icons/typeIcon_${pokemonIconNames[index]}.png" alt="${pokemonIconNames[index]}" title="${pokemonIconNames[index]}">`;
    }
}

/**
 * Extracts and displays the abilities of a Pokémon.
 * @param {Object} selectedPokemon - The Pokémon whose abilities are to be displayed.
 */
function getPkmAbilities(selectedPokemon) {
    pokemonAbilities = [];
    for (let index = 0; index < selectedPokemon.abilities.length; index++) {
        pokemonAbilities.push(selectedPokemon.abilities[index].ability.name);
        document.getElementById("overlay").innerHTML = detailCardTemplate(selectedPokemon, pokemonAbilities);
    }
}

/**
 * This function retrieves the name of the next or previous Pokémon in the list based on the current Pokémon's name
 * and the direction provided. The direction determines whether to go forward or backward in the list.
 *
 * @param {string} currentName - The name of the current Pokémon.
 * @param {number} direction - The direction to move in the list. A positive number moves forward, and a negative number moves backward.
 * @returns {string|null} The name of the next or previous Pokémon, or null if the current Pokémon is not found in the list.
 * 
 * @example
 * // If currentName is "bulbasaur" and direction is 1 (forward), the function will return the next Pokémon's name.
 * getNextPokemonName("bulbasaur", 1);  // Returns the name of the next Pokémon.
 */
function getNextPokemonName(currentName, direction) {
    let currentIndex = pokemonList.findIndex(pokemon => pokemon.name === currentName);

    if (currentIndex === -1) {
        return null;
    }

    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
        nextIndex = pokemonList.length - 1;
    } else if (nextIndex >= pokemonList.length) {
        nextIndex = 0;
    }
    return pokemonList[nextIndex].name;
}

/**
 * Closes the overlay and restores the body's ability to scroll.
 */
function overlayOff() {
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = "auto";
}

/**
 * Stops the event from propagating, preventing it from triggering other listeners.
 * @param {Event} event - The event to stop propagation for.
 */
function logDownWithBubblingPrevention(event) {
    event.stopPropagation();
};

/*-------------------------------------------------------- Show Pokemon Details Section --------------------------------------------------------*/
/**
 * Displays the main details of a Pokémon in the detail content section.
 * @param {string} pokemonName - The name of the Pokémon whose main details are to be shown.
 */
function showMainDetails(pokemonName) {
    clearMainRef();
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    if (selectedPokemon) {
        document.getElementById("detail_content").innerHTML = mainDetailsTemplate(selectedPokemon, pokemonAbilities);
    }
}

/**
 * Displays the stats details of a Pokémon in the detail content section.
 * @param {string} pokemonName - The name of the Pokémon whose stats are to be shown.
 */
function showStatsDetails(pokemonName) {
    clearMainRef();
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);

    if (selectedPokemon) {
        document.getElementById("detail_content").innerHTML = statsTemplate(selectedPokemon);
    }
}

/**
 * Displays the evolution chain details of a Pokémon in the detail content section.
 * @param {string} pokemonName - The name of the Pokémon whose evolution chain is to be shown.
 */
function showEvoChainDetails(pokemonName) {
    clearMainRef();
    let selectedPokemon = pokemonList.find(pokemon => pokemon.name === pokemonName);
    let firstEvoChainPkm = selectedPokemon.evolutionChain.species.name;
    let secondEvoChainPkm = selectedPokemon.evolutionChain.evolves_to[0].species.name;
    let thirdEvoChainPkm = null;
    let firstEvoChainPkmImage;
    let secondEvoChainPkmImage;
    let thirdEvoChainPkmImage;

    if (selectedPokemon.evolutionChain.evolves_to[0].evolves_to && selectedPokemon.evolutionChain.evolves_to[0].evolves_to.length > 0) {
        thirdEvoChainPkm = selectedPokemon.evolutionChain.evolves_to[0].evolves_to[0].species.name;
    }

    pokemonList.forEach(pokemon => {
        if (pokemon.name.toLowerCase() === firstEvoChainPkm) {
            firstEvoChainPkmImage = pokemon.image;           
        } else if (pokemon.name.toLowerCase() === secondEvoChainPkm) {
            secondEvoChainPkmImage = pokemon.image;
        } else if (pokemon.name.toLowerCase() === thirdEvoChainPkm) {
            thirdEvoChainPkmImage = pokemon.image;
        }
    });

    if (selectedPokemon) {
        document.getElementById("detail_content").innerHTML = evoChainTemplate(firstEvoChainPkmImage, secondEvoChainPkmImage, thirdEvoChainPkmImage);
    }
}

/**
 * Clears the main detail content section.
 */
function clearMainRef() {
    let mainRef = document.getElementById('detail_content');
    mainRef.innerHTML = "";
}