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

function detailCardTemplate(pokemon, pokemonAbilities) {
    return `    
            <div class="card-body">
                <div onclick="logDownWithBubblingPrevention(event)" class="detail-card-body">
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

function mainDetailsTemplate(pokemon, pokemonAbilities) {
    return `
                <div class="details">
                    <div class="detail-properties">
                        Height
                    </div>
                    <div>
                        : ${(pokemon.height / 10).toFixed(2).replace(".", ",")} m
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Weight
                    </div>
                    <div>
                        : ${(pokemon.weight / 10).toFixed(2).replace(".", ",")} kg
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Base_experience
                    </div>
                    <div>
                        : ${pokemon.baseExperience}
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Abilities
                    </div>
                    <div>
                        : ${pokemonAbilities.join(", ")}
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Habitat
                    </div>
                    <div>
                        : ${pokemon.habitat.name}
                    </div>
                </div>
                <div class="details">
                    <div class="detail-properties">
                        Shape
                    </div>
                    <div>
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

function evoChainTemplate() {
    return `
        <div class="evo-chain">
            <!-- Erstes Pokémon in der Evolution -->
            <div>
                Comming soon...
            </div>                           
        </div>
            `;
}

