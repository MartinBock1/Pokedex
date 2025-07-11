// =================================================================================
// Global Variables & Configuration
// =================================================================================

/**
 * @type {Array<Object>}
 * @description An array to store all fetched Pokémon data objects.
 */
let pokemonList = [];

/**
 * @type {number}
 * @description A counter for the number of Pokémon currently rendered on the page.
 */
let renderedPokemonCount = 0;

/**
 * @const
 * @type {number}
 * @description The number of Pokémon to render in each batch when loading more.
 */
const RENDER_INCREMENT = 40;

/**
 * @type {boolean}
 * @description A flag to ensure the initial fetch of all Pokémon data happens only once.
 */
let allPokemonsFetched = false;

// Set the current year in the footer dynamically.
let year = new Date().getFullYear();
document.getElementById("year").textContent = year;

// =================================================================================
// Initialization
// =================================================================================

/**
 * Initializes the application.
 * Sets up event listeners and orchestrates the initial data fetch and render cycle.
 * @async
 */
async function init() {
  document
    .getElementById("search")
    .addEventListener("input", debounce(handleSearchInput, 300));
  document.getElementById("myButton").disabled = true;

  showLoadingScreen();
  await fetchAllPokemonData();

  // Reset view before the first render
  renderedPokemonCount = 0;
  document.getElementById("content").innerHTML = "";
  renderPokemonData(); // Render the first batch

  hideLoadingScreen();

  // Enable the 'load more' button only if there are more Pokémon to show.
  if (renderedPokemonCount < pokemonList.length) {
    document.getElementById("myButton").disabled = false;
  }
}

// =================================================================================
// Data Fetching
// =================================================================================

/**
 * Fetches all Pokémon data from the API efficiently and robustly by processing requests in batches.
 * This prevents network errors from flooding the server with too many concurrent requests.
 * @async
 */
async function fetchAllPokemonData() {
  if (allPokemonsFetched) return;

  try {
    // Step 1: Fetch the initial list, this is fine as it's a single request.
    const responseList = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1800&offset=0"
    );
    const dataList = await responseList.json();

    // Step 2: Process detail fetches in batches.
    const pokemonDetailsArray = [];
    const detailChunkSize = 100; // Process 50 requests at a time.
    console.log("Fetching details in batches...");
    for (let i = 0; i < dataList.results.length; i += detailChunkSize) {
      const chunk = dataList.results.slice(i, i + detailChunkSize);
      const detailPromises = chunk.map((pokemon) =>
        fetch(pokemon.url).then((res) => res.json())
      );
      const details = await Promise.all(detailPromises);
      pokemonDetailsArray.push(...details);
      console.log(`Fetched details for Pokémon ${i + 1} to ${i + chunk.length}`);
    }

    // Step 3: Process final data (species, evolution) in batches.
    const finalPokemonList = [];
    const finalChunkSize = 50;
    console.log("Fetching species & evolution data in batches...");
    for (let i = 0; i < pokemonDetailsArray.length; i += finalChunkSize) {
        const chunk = pokemonDetailsArray.slice(i, i + finalChunkSize);
        const finalPromises = chunk.map(async (pDetail) => {
            const speciesPromise = fetch(pDetail.species.url).then((res) => res.json());
            const speciesDetails = await speciesPromise;
            const evolutionPromise = fetch(speciesDetails.evolution_chain.url).then((res) => res.json());
            const evolutionChainDetails = await evolutionPromise;
            const flavorTextEntry = speciesDetails.flavor_text_entries.find((entry) => entry.language.name === "en");
            const flavorText = flavorTextEntry ? flavorTextEntry.flavor_text : "No description available.";
            
            return {
                name: pDetail.name,
                id: pDetail.id,
                image: pDetail.sprites.other.home.front_default,
                types: pDetail.types,
                color: speciesDetails.color.name,
                height: pDetail.height,
                weight: pDetail.weight,
                baseExperience: pDetail.base_experience,
                abilities: pDetail.abilities,
                flavortext: flavorText,
                habitat: speciesDetails.habitat,
                shape: speciesDetails.shape,
                evolutionChain: evolutionChainDetails.chain,
                stats: pDetail.stats,
            };
        });
        const finalData = await Promise.all(finalPromises);
        finalPokemonList.push(...finalData);
        console.log(`Fetched final data for Pokémon ${i + 1} to ${i + chunk.length}`);
    }

    pokemonList = finalPokemonList;
    pokemonList.sort((a, b) => a.id - b.id);
    allPokemonsFetched = true;
    console.log("All Pokémon data fetched successfully!");

  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    document.getElementById(
      "content"
    ).innerHTML = `<div class="error-Message">A network error occurred while loading Pokémon data. Please try refreshing the page. Error: ${error.message}</div>`;
  }
}

// =================================================================================
// Rendering & Display Logic
// =================================================================================

/**
 * Renders a batch of Pokémon from the main list into the content area.
 * It appends new cards to the existing ones based on `renderedPokemonCount`.
 */
function renderPokemonData() {
  const contentRef = document.getElementById("content");
  const startIndex = renderedPokemonCount;
  const endIndex = Math.min(startIndex + RENDER_INCREMENT, pokemonList.length);

  for (let i = startIndex; i < endIndex; i++) {
    const pokemon = pokemonList[i];
    contentRef.innerHTML += miniCardTemplate(pokemon); // Assumes miniCardTemplate exists in template.js
    document.getElementById(
      `mini_card_body_${pokemon.name}`
    ).style.backgroundColor = pokemon.color;
    renderMiniCardIcons(pokemon);
  }
  // Update the counter for how many Pokémon are now visible.
  renderedPokemonCount = endIndex;

  // Show or hide the "load more" button based on whether all Pokémon have been rendered.
  if (renderedPokemonCount >= pokemonList.length) {
    document.getElementById("myButton").style.display = "none";
  } else {
    document.getElementById("myButton").style.display = "block";
  }
}

/**
 * Renders a list of Pokémon provided (typically from search results).
 * This will clear any existing content before rendering.
 * @param {Array<Object>} pokemonToRender - The list of Pokémon objects to display.
 */
function renderSearchResults(pokemonToRender) {
  const contentRef = document.getElementById("content");
  contentRef.innerHTML = ""; // Clear existing content first.

  if (pokemonToRender.length === 0) {
    contentRef.innerHTML =
      '<div class="error-Message">No Pokemon found matching your search criteria. Please try again.</div>';
  } else {
    pokemonToRender.forEach((pokemon) => {
      contentRef.innerHTML += miniCardTemplate(pokemon);
      document.getElementById(
        `mini_card_body_${pokemon.name}`
      ).style.backgroundColor = pokemon.color;
      renderMiniCardIcons(pokemon);
    });
  }
  // Search results are always fully displayed, so hide the "load more" button.
  document.getElementById("myButton").style.display = "none";
}

/**
 * Renders the type icons for a specific Pokémon in its mini card.
 * @param {Object} pokemon - The Pokémon object.
 */
function renderMiniCardIcons(pokemon) {
  const iconElement = document.getElementById(`mini_card_icon_${pokemon.name}`);
  if (!iconElement) return; // Fail safely if the element is not found.

  iconElement.innerHTML = ""; // Clear previous icons.
  pokemon.types.forEach((typeInfo) => {
    iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${typeInfo.type.name}.png" alt="${typeInfo.type.name}">`;
  });
}

// =================================================================================
// User Interaction Handlers
// =================================================================================

/**
 * Handles the click on the "load more" button.
 * It uses the main loading spinner for a simulated loading experience and correctly scrolls to the new content.
 */
function loadMore() {
  const loadButton = document.getElementById("myButton");
  if (!loadButton) return;

  const firstNewElementIndex = renderedPokemonCount;

  // 1. Activate loading state.
  loadButton.disabled = true;
  showLoadingScreen();

  // 2. Simulate a network delay for better user experience.
  setTimeout(() => {
    // 3. Render the new Pokémon cards to the (currently hidden) grid.
    renderPokemonData();

    // 4. Deactivate the loading state, making the updated grid visible.
    hideLoadingScreen();

    // 5. Give the browser a moment to render before scrolling to avoid race conditions.
    setTimeout(() => {
      const contentContainer = document.getElementById("content");
      const firstNewCard = contentContainer.children[firstNewElementIndex];
      if (firstNewCard) {
        firstNewCard.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 10); // A small delay is enough to fix the scroll issue.

    // 6. Re-enable the button if there are still more Pokémon to load.
    if (renderedPokemonCount < pokemonList.length) {
      loadButton.disabled = false;
    }
  }, 750); // 750ms feels responsive yet noticeable.
}

/**
 * Handles user input in the search field. Filters Pokémon and displays results.
 * @param {Event} event - The input event object.
 */
function handleSearchInput(event) {
  const filterWord = event.target.value.trim().toLowerCase();
  const warningElement = document.getElementById("min-letters-warning");

  if (filterWord.length >= 3) {
    warningElement.style.display = "none";
    // Filter the complete list of Pokémon in memory.
    const filteredPokemons = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(filterWord)
    );
    renderSearchResults(filteredPokemons);
  } else {
    warningElement.style.display = "block";
    // If the search term is too short, restore the default paginated view.
    restoreInitialView();
  }
}

/**
 * Restores the default paginated view of the Pokémon list when the search is cleared.
 */
function restoreInitialView() {
  const contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  renderedPokemonCount = 0; // Reset the counter.
  renderPokemonData(); // Render the first page again.
  document.getElementById("min-letters-warning").style.display = "none";
}

// =================================================================================
// Overlay & Detail View Logic
// =================================================================================

/**
 * Shows the overlay with detailed information for a specific Pokémon.
 * @param {string} pokemonName - The name of the Pokémon to display.
 */
function overlayOn(pokemonName) {
  const selectedPokemon = pokemonList.find(
    (pokemon) => pokemon.name === pokemonName
  );
  if (!selectedPokemon) return;

  document.getElementById("overlay").style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent background scrolling.

  // Extract abilities locally instead of using a global variable.
  const pokemonAbilities = selectedPokemon.abilities.map(
    (abilityInfo) => abilityInfo.ability.name
  );

  // Pass the necessary data to the template function.
  document.getElementById("overlay").innerHTML = detailCardTemplate(
    selectedPokemon,
    pokemonAbilities
  );

  document.getElementById(
    `detail_card_body_${selectedPokemon.name}`
  ).style.backgroundColor = selectedPokemon.color;
  renderDetailCardIcons(selectedPokemon);
  // Show the main details by default when opening the overlay.
  showMainDetails(pokemonName);
}

/**
 * Closes the detail overlay view.
 */
function overlayOff() {
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = "auto"; // Restore background scrolling.
}

/**
 * Renders the type icons in the detail card view.
 * @param {Object} selectedPokemon - The Pokémon object currently shown in the overlay.
 */
function renderDetailCardIcons(selectedPokemon) {
  const iconElement = document.getElementById("detail_card_icon");
  if (!iconElement) return;

  iconElement.innerHTML = "";
  selectedPokemon.types.forEach((typeInfo) => {
    iconElement.innerHTML += `<img src="./img/pokedex_icons/typeIcon_${typeInfo.type.name}.png" alt="${typeInfo.type.name}" title="${typeInfo.type.name}">`;
  });
}

/**
 * Finds the next or previous Pokémon within the currently RENDERED list.
 * This allows navigation to wrap around only the visible Pokémon cards.
 * @param {string} currentName - The name of the current Pokémon.
 * @param {number} direction - The direction to navigate: 1 for next, -1 for previous.
 * @returns {string|null} The name of the adjacent Pokémon, or null if not found.
 */
function getNextPokemonName(currentName, direction) {
  const currentIndex = pokemonList.findIndex(
    (pokemon) => pokemon.name === currentName
  );
  if (currentIndex === -1) return null;

  let nextIndex = currentIndex + direction;

  // Wrap-around logic based on the number of RENDERED Pokémon.
  if (nextIndex < 0) {
    nextIndex = renderedPokemonCount - 1; // Go to the last rendered Pokémon.
  } else if (nextIndex >= renderedPokemonCount) {
    nextIndex = 0; // Go to the first Pokémon.
  }

  return pokemonList[nextIndex].name;
}

/**
 * Displays the "About" section in the detail card.
 * @param {string} pokemonName - The name of the Pokémon.
 */
function showMainDetails(pokemonName) {
  const selectedPokemon = pokemonList.find(
    (pokemon) => pokemon.name === pokemonName
  );
  if (!selectedPokemon) return;

  const pokemonAbilities = selectedPokemon.abilities.map((a) => a.ability.name);
  document.getElementById("detail_content").innerHTML = mainDetailsTemplate(
    selectedPokemon,
    pokemonAbilities
  );
}

/**
 * Displays the "Base Stats" section in the detail card.
 * @param {string} pokemonName - The name of the Pokémon.
 */
function showStatsDetails(pokemonName) {
  const selectedPokemon = pokemonList.find(
    (pokemon) => pokemon.name === pokemonName
  );
  if (!selectedPokemon) return;

  document.getElementById("detail_content").innerHTML =
    statsTemplate(selectedPokemon);
}

/**
 * Displays the "Evolution" section in the detail card by traversing the evolution chain.
 * @param {string} pokemonName - The name of the Pokémon.
 */
function showEvoChainDetails(pokemonName) {
  const selectedPokemon = pokemonList.find(
    (pokemon) => pokemon.name === pokemonName
  );
  if (!selectedPokemon) return;

  // Use the helper function to get all evolution images.
  const evolutionImages = getEvolutionImages(selectedPokemon.evolutionChain);

  // Pass the images to the template, providing null for missing evolutions.
  document.getElementById("detail_content").innerHTML = evoChainTemplate(
    evolutionImages[0] || null,
    evolutionImages[1] || null,
    evolutionImages[2] || null
  );
}

/**
 * Recursively traverses an evolution chain and collects the corresponding Pokémon images.
 * It uses a case-insensitive comparison to robustly find matches in the `pokemonList`.
 * @param {Object} chainNode - The current node in the evolution chain from the API.
 * @returns {Array<string|null>} An array of image URLs for the entire evolution line.
 */
function getEvolutionImages(chainNode) {
  if (!chainNode) {
    return [];
  }

  const evoLineImages = [];
  const speciesName = chainNode.species.name.toLowerCase();

  // Find the Pokémon using a case-insensitive comparison.
  const pokemon = pokemonList.find((p) => p.name.toLowerCase() === speciesName);
  // Push the image URL or null if the Pokémon was not found.
  evoLineImages.push(pokemon ? pokemon.image : null);

  // If there is a next evolution step, recursively call this function for it.
  // This handles chains of varying lengths.
  if (chainNode.evolves_to && chainNode.evolves_to.length > 0) {
    const nextEvolutions = getEvolutionImages(chainNode.evolves_to[0]);
    evoLineImages.push(...nextEvolutions);
  }

  return evoLineImages;
}

// =================================================================================
// Utilities
// =================================================================================

/**
 * Shows the main loading spinner and hides the content grid.
 */
function showLoadingScreen() {
  const loadingRef = document.getElementById("loadingSpinner");
  const contentRef = document.getElementById("content");
  contentRef.style.display = "none";
  loadingRef.style.display = "block";
  loadingRef.innerHTML = loadingSpinnerTemplate(); // Assumes this function is in template.js
}

/**
 * Hides the main loading spinner and shows the content grid.
 */
function hideLoadingScreen() {
  const loadingRef = document.getElementById("loadingSpinner");
  const contentRef = document.getElementById("content");
  loadingRef.style.display = "none";
  contentRef.style.display = "flex";
}

/**
 * Stops event propagation to prevent parent handlers from firing (e.g., closing overlay).
 * @param {Event} event - The event object.
 */
function logDownWithBubblingPrevention(event) {
  event.stopPropagation();
}

/**
 * Clears the content of the detail view section inside the overlay.
 */
function clearMainRef() {
  document.getElementById("detail_content").innerHTML = "";
}

/**
 * Creates a debounced function that delays execution. This prevents a function from
 * being called too frequently, such as on every keystroke in a search field.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {Function} The new debounced function.
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}