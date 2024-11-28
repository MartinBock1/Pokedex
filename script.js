let loadToId = 5;
let isLoading = false;   // ladeanimation

function init() {
    progressCircle()
    // renderPokemonData();
}

function loadMore() {
    loadToId = loadToId + loadToId;
    progressCircle();
    // renderPokemonData()
}

function progressCircle() {
    if (!isLoading) {
        let contentRef = document.getElementById('content');
        contentRef.innerHTML = "";

        document.getElementById('content').innerHTML = progressCircleTemplate();
       
        // Setzt isLoading auf true, um sicherzustellen, dass die Animation nicht sofort wieder verschwindet
        renderPokemonData();
        isLoading = true;

        // Ladeanimation für eine Mindestzeit anzeigen (z.B. 2 Sekunden)
        setTimeout(() => {
            // Hier kannst du die Ladeanimation wieder ausblenden, wenn die Daten fertig geladen sind
            isLoading = false;
        }, 5000); // Mindestzeit für die Ladeanimation (2 Sekunden)
    }
}

// Function fetches the list of Pokémon names and their URLs from the API
async function fetchPokemonNames() {
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${loadToId}&offset=0`);

        // Parse and returns the JSON response
        return await response.json();

    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById('content').innerHTML = `Fehler: ${error.message}`;
    }
}

/**Function fetches detailed data for a specific Pokémon
 * This includes both the first-level details (general Pokémon info) and second-level details (species-specific info like color)
 * 
 * @param {*} pokemonUrl 
 * @returns firstLevelDetails, secondLevelDetails
 */
async function fetchPokemonDetails(pokemonUrl) {
    // Fetch the first-level details using the Pokémon's URL
    let firstLevelResponse = await fetch(pokemonUrl);
    let firstLevelDetails = await firstLevelResponse.json();

    // Fetch the second-level details using the species URL
    let secondLevelResponse = await fetch(firstLevelDetails.species.url);
    let secondLevelDetails = await secondLevelResponse.json();
    // console.log(secondLevelResponse);

    let thirdLevelDetails;
    // Fetch the third-level details using the forms URL
    for (let i = 0; i < firstLevelDetails.forms.length; i++) {
        const element = firstLevelDetails.forms[i];

        let thirdLevelResponse = await fetch(element.url);
        thirdLevelDetails = await thirdLevelResponse.json();
        thirdLevelDetails = thirdLevelDetails.pokemon.url;
        // console.log(thirdLevelDetails);
    }

    // Return both levels of details as an object
    return { firstLevelDetails, secondLevelDetails, thirdLevelDetails };
}

// Function fetches Pokémon data, processes it, and renders it as mini-cards;
async function renderPokemonData() {
    // Fetch the list of Pokémon names and URLs
    let pokemonNamesData = await fetchPokemonNames();
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";

    for (let i = 0; i < pokemonNamesData.results.length; i++) {
        let pokemon = pokemonNamesData.results[i];
        // console.log(pokemon);

        // Fetch detailed information for the current Pokémon
        let { firstLevelDetails, secondLevelDetails, thirdLevelDetails } = await fetchPokemonDetails(pokemon.url);

        let pokemonIconNames = [];
        for (let j = 0; j < firstLevelDetails.types.length; j++) {
            pokemonIconNames.push(firstLevelDetails.types[j].type.name); // Collecting the type names
            // console.log(pokemonIconNames);            
        }
        // Render the Pokémon card using the fetched details
        document.getElementById('content').innerHTML += miniCardTemplate(pokemon, firstLevelDetails, secondLevelDetails, thirdLevelDetails, pokemonIconNames);

        // Set the background color of the specific card using its name
        document.getElementById(`mini_card_body_${pokemon.name}`).style.backgroundColor = secondLevelDetails.color.name;

        // Now update the 'mini_card_icon' with the pokemonIcons.name for each type using a for loop
        for (let i = 0; i < pokemonIconNames.length; i++) {
            const typeName = pokemonIconNames[i];
            document.getElementById(`mini_card_icon_${pokemon.name}`).innerHTML += `<img src="./img/pokedex_icons/typeIcon_${typeName}.png" alt="${typeName}">`;
        }
    }
}

function on() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlay").innerHTML = detailCardTemplate();
}

function off() {
    document.getElementById("overlay").style.display = "none";
}