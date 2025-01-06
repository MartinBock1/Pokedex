/**
 * Generates an HTML template for a mini Pokémon card.
 * The mini card includes the Pokémon's ID, name, image, and a clickable area 
 * that triggers the display of the Pokémon's detailed information in an overlay.
 * The Pokémon's name is capitalized in the card for a better presentation.
 *
 * The generated mini card contains:
 * - The Pokémon's ID prefixed with a "#" symbol.
 * - The Pokémon's name with the first letter capitalized.
 * - The Pokémon's image, which is clickable to show the details.
 * - A clickable area that triggers the overlay to display the Pokémon's detailed information.
 *
 * @param {Object} pokemon - The Pokémon object containing details such as ID, name, and image.
 * @returns {string} The HTML structure for the mini Pokémon card.
 *
 * @example
 * // Generates the mini card for a specific Pokémon
 * const miniCard = miniCardTemplate(pokemon);
 * document.getElementById('mini-card-container').innerHTML += miniCard;
 */
function miniCardTemplate(pokemon) {
    /** pokemonName firstChar uppercase
     * Get the first character of the name string (character at index 0).
     * Example: For "pikachu", this would be "p".
     * Convert the first character to uppercase.
     * Example: "p" becomes "P".
     * Concatenate the uppercase first letter with the rest of the string
     * (starting from the second character, index 1, to the end).
     * Example: "ikachu" (from "pikachu").
     * The result is a string with the first letter capitalized.
     * Example: "Pikachu".
    */
    pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    return `    
            <div class="mini-card-body" onclick="overlayOn('${pokemon.name}')" title="Show Details">
                <div class="mini-card-body-top">
                    <div>
                        #${pokemon.id}
                    </div>
                    <div>
                        ${pokemon.name}
                    </div>
                    <div></div>                         
                </div>
                <div class="mini-card-body-img" id="mini_card_body_${pokemon.name}">
                    <img src="${pokemon.image}" alt="Image of ${pokemon.name}">
                </div>
                <div class="mini-card-body-bottom" id="mini_card_icon_${pokemon.name}">
                </div>                    
            </div>
        `;
}

/**
 * Generates an HTML template for displaying detailed information about a Pokémon in a card format.
 * The template includes sections for the Pokémon's name, ID, image, abilities, stats, evolution chain, and more.
 * It also includes interactive buttons for navigating through Pokémon details and a close button to hide the overlay.
 *
 * The generated card contains:
 * - Pokémon's ID and name.
 * - A close button (X) to dismiss the overlay.
 * - Navigation buttons to go to the previous or next Pokémon.
 * - Pokémon's image and abilities.
 * - A navigation section with buttons to switch between main details, stats, and evolution chain.
 * - A details section that displays Pokémon's height, weight, base experience, abilities, habitat, shape, and flavor text.
 *
 * @param {Object} pokemon - The Pokémon object containing detailed information.
 * @param {Array} pokemonAbilities - An array of abilities associated with the Pokémon.
 * @returns {string} The HTML structure of the Pokémon detail card.
 *
 * @example
 * // Generates the detail card for a specific Pokémon
 * const pokemonDetailCard = detailCardTemplate(selectedPokemon, selectedPokemonAbilities);
 * document.getElementById('card-container').innerHTML = pokemonDetailCard;
 */
function detailCardTemplate(pokemon, pokemonAbilities) {
    return `    
            <div class="card-body">
                <div onclick="logDownWithBubblingPrevention(event)" class="detail-card-body flip-vertical-fwd">
                    <div class="detail-card-body-top">
                        <div>
                            #${pokemon.id}
                        </div>
                        <div>
                            ${pokemon.name}
                        </div>
                        <div>
                            <h3 onclick="overlayOff()" title="close">X</h3>
                        </div>                         
                    </div>
                    <div class="detail-card-body-img" id="detail_card_body_${pokemon.name}">
                        <img onclick="overlayOn('${getNextPokemonName(pokemon.name, -1)}')" 
                                class="arrows-icons" src="./img/icons/arrow_back.png" title="back">
                        <img class="pokemon-image" src="${pokemon.image}" alt="Image of ${pokemon.name}">
                        <img onclick="overlayOn('${getNextPokemonName(pokemon.name, 1)}')" 
                            class="arrows-icons" src="./img/icons/arrow_forward.png" title="next">
                    </div>
                    <div class="detail-card-icon-body" id="detail_card_icon">                 
                    </div>
                    
                    <div class="details-block">
                        <div class="nav">
                            <button class="detail-btn" onclick="showMainDetails('${pokemon.name}')">
                                main
                            </button>
                            <button class="detail-btn" onclick="showStatsDetails('${pokemon.name}')">
                                stats
                            </button>
                            <button class="detail-btn" onclick="showEvoChainDetails('${pokemon.name}')">
                                Evo chain
                            </button>
                        </div>                        
                        <div class="detail-content" id="detail_content">
                            <div class="details">
                                <div class="detail-properties">
                                    Height
                                </div> 
                                <div class="detail-values">
                                    : ${(pokemon.height / 10).toFixed(2).replace(".", ",")} m
                                </div>
                            </div>
                            <div class="details">
                                <div class="detail-properties">
                                    Weight
                                </div>
                                <div class="detail-values">
                                    : ${(pokemon.weight / 10).toFixed(2).replace(".", ",")} kg
                                </div>
                            </div>
                            <div class="details">
                                <div class="detail-properties">
                                    Base_experience
                                </div>
                                <div class="detail-values">
                                    : ${pokemon.baseExperience}
                                </div>
                            </div>
                            <div class="details">
                                <div class="detail-properties">
                                    Abilities
                                </div>
                                <div class="detail-values">
                                    : ${pokemonAbilities.join(", ")}
                                </div>
                            </div>
                            <div class="details">
                                <div class="detail-properties">
                                    Habitat
                                </div>
                                <div class="detail-values">
                                    : ${pokemon.habitat.name}
                                </div>
                            </div>
                            <div class="details">
                                <div class="detail-properties">
                                    Shape
                                </div>
                                <div class="detail-values">
                                    : ${pokemon.shape.name}
                                </div>
                            </div>
                            <div class="details">                                
                                <div>
                                    <br>${pokemon.flavortext.replace("\f", "")}
                                </div>
                            </div>
                        </div>
                    </div>                              
                </div>
            </div>
        `;
}

/**
 * Generates an HTML template for a loading spinner, typically used to display a loading state
 * while data (e.g., Pokémon information) is being fetched or processed.
 *
 * This template includes an image representing the spinner and a text indicating that Pokémon
 * are being loaded.
 *
 * @returns {string} The HTML structure of the loading spinner, including an image and loading text.
 *
 * @example
 * // Generates the loading spinner HTML template
 * loadingSpinnerTemplate();
 */
function loadingSpinnerTemplate() {
    return `
                <div class="spinner-img">
                    <img src="./img/superball.png" alt="">
                    
                </div>
                <div class="loading-text">
                    load Pokemons...
                </div>
            `;
}

/**
 * Generates an HTML template displaying various details about a Pokémon, including its height, weight, base experience, abilities, habitat, shape, and flavor text.
 * This template is used to show detailed information about the selected Pokémon in the interface.
 *
 * @param {Object} pokemon - The Pokémon whose details are to be displayed.
 * @param {number} pokemon.height - The height of the Pokémon in decimeters.
 * @param {number} pokemon.weight - The weight of the Pokémon in hectograms.
 * @param {number} pokemon.baseExperience - The base experience value of the Pokémon.
 * @param {Object} pokemon.habitat - The habitat object containing the habitat name of the Pokémon.
 * @param {Object} pokemon.shape - The shape object containing the shape name of the Pokémon.
 * @param {string} pokemon.flavortext - The flavor text that describes the Pokémon in-game.
 * @param {Array<string>} pokemonAbilities - An array of strings representing the abilities of the Pokémon.
 * @returns {string} The HTML structure containing the details of the Pokémon.
 *
 * @example
 * // Generates the details template for the Pokémon with name "Pikachu", including its height, weight, abilities, and other information.
 * mainDetailsTemplate(pikachu, ["Static", "Lightning Rod"]);
 */
function mainDetailsTemplate(pokemon, pokemonAbilities) {
    return `
                <div class="details">
                    <div class="detail-properties">
                        Height
                    </div>
                    <div class="detail-values">
                        : ${(pokemon.height / 10).toFixed(2).replace(".", ",")} m
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Weight
                    </div>
                    <div class="detail-values">
                        : ${(pokemon.weight / 10).toFixed(2).replace(".", ",")} kg
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Base_experience
                    </div>
                    <div class="detail-values">
                        : ${pokemon.baseExperience}
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Abilities
                    </div>
                    <div class="detail-values">
                        : ${pokemonAbilities.join(", ")}
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Habitat
                    </div>
                    <div class="detail-values">
                        : ${pokemon.habitat.name}
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Shape
                    </div>
                    <div class="detail-values">
                        : ${pokemon.shape.name}
                    </div>
                </div>
                <div class="details">                                
                    <div>
                        <br>${pokemon.flavortext.replace("\f", "")}
                    </div>
                </div>
            `;
}

/**
 * This function generates an HTML structure displaying the stats of a selected Pokémon, including each stat's name, its base value, and a progress bar visualizing the stat value as a percentage of the maximum stat value (255).
 * It generates details for each stat in the Pokémon's stats array and creates a progress bar for each stat based on its value.
 *
 * @param {Object} selectedPokemon - The Pokémon whose stats will be displayed.
 * @param {Array} selectedPokemon.stats - An array of stat objects for the selected Pokémon, where each stat contains a `stat.name` (the stat's name) and `base_stat` (the stat's value).
 * @returns {string} The HTML structure containing the stats and progress bars for the selected Pokémon.
 * 
 * @example
 * // Generates the stats section for the selected Pokémon, showing stat names, values, and progress bars.
 * statsTemplate(selectedPokemon);
 */
function statsTemplate(selectedPokemon) {
    let maxStatValue = 255;  // Max StatValue for scaling (usually 255)

    // Helper function to create the progress bar
    function createProgressBar(statValue) {
        let percentage = (statValue / maxStatValue) * 100; // Calculating the percentage
        return `
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${percentage}%;"></div>
            </div>
        `;
    }
    return `      
                <div class="details">
                    <div class="detail-properties">
                        ${selectedPokemon.stats[0].stat.name} 
                    </div>
                    <div class="stats-values">                        
                        : ${selectedPokemon.stats[0].base_stat} / 255
                    </div>                    
                     ${createProgressBar(selectedPokemon.stats[0].base_stat)}
                    
                </div>
                <div class="details">
                    <div class="detail-properties">
                        ${selectedPokemon.stats[1].stat.name} 
                    </div>
                    <div class="stats-values">                      
                        : ${selectedPokemon.stats[1].base_stat} / 255
                    </div>
                    ${createProgressBar(selectedPokemon.stats[1].base_stat)}
                </div>
                <div class="details">
                    <div class="detail-properties">
                        ${selectedPokemon.stats[2].stat.name} 
                    </div>
                    <div class="stats-values">                     
                        : ${selectedPokemon.stats[2].base_stat} / 255
                    </div>
                    ${createProgressBar(selectedPokemon.stats[2].base_stat)}
                </div>
                <div class="details">
                    <div class="detail-properties">
                        ${selectedPokemon.stats[3].stat.name} 
                    </div>
                    <div class="stats-values">                      
                        : ${selectedPokemon.stats[3].base_stat} / 255
                    </div>
                    ${createProgressBar(selectedPokemon.stats[3].base_stat)}
                </div>
                <div class="details">
                    <div class="detail-properties">
                        ${selectedPokemon.stats[4].stat.name} 
                    </div>
                    <div class="stats-values">                      
                        : ${selectedPokemon.stats[4].base_stat} / 255
                    </div>
                    ${createProgressBar(selectedPokemon.stats[4].base_stat)}
                </div>
                <div class="details">
                    <div class="detail-properties">
                        ${selectedPokemon.stats[5].stat.name} 
                    </div>
                    <div class="stats-values">                      
                        : ${selectedPokemon.stats[5].base_stat} / 255
                    </div>
                    ${createProgressBar(selectedPokemon.stats[5].base_stat)}
                </div>
            `;
}

/**
 * This function generates the HTML structure for displaying a Pokémon's evolutionary chain, including images of the Pokémon at each evolution stage.
 * It accepts images for the first, second, and optionally the third evolution stages, and returns an HTML string representing the evolutionary chain.
 *
 * @param {string} firstEvoChainPkmImage - The image URL for the first evolution stage Pokémon.
 * @param {string} secondEvoChainPkmImage - The image URL for the second evolution stage Pokémon.
 * @param {string} [thirdEvoChainPkmImage] - The image URL for the third evolution stage Pokémon (optional).
 * @returns {string} The HTML structure containing the evolution stages and their respective images.
 * 
 * @example
 * // Generates HTML for the evolutionary chain, where thirdEvoChainPkmImage is optional.
 * evoChainTemplate("path/to/first_image.png", "path/to/second_image.png", "path/to/third_image.png");
 */
function evoChainTemplate(firstEvoChainPkmImage, secondEvoChainPkmImage, thirdEvoChainPkmImage) {
    return `
        <div class="evo-chain">
            <!-- First Pokémon in the Evolution -->
            <div class="evo-chain-content">
                <h3>First Evolution Stage</h3>
                <img class="evo-chain-image" src="${firstEvoChainPkmImage}" alt="First Evolution Pokémon">
            </div>
            
            <!-- Second Pokémon in the Evolution -->
            <div class="evo-chain-content">
                <h3>Second Evolution Stage</h3>
                <img class="evo-chain-image" src="${secondEvoChainPkmImage}" alt="Second Evolution Pokémon">
            </div>

            <!-- Third Pokémon in the Evolution (if exists) -->
            ${thirdEvoChainPkmImage ? `
            <div class="evo-chain-content">
                <h3>Third Evolution Stage</h3>
                <img class="evo-chain-image" src="${thirdEvoChainPkmImage}" alt="Third Evolution Pokémon">
            </div>
            ` : ''}
        </div>
    `;
}