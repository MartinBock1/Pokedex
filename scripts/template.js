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
            <div class="mini_card_body" onclick="overlayOn('${pokemon.name}')" title="Show Details">
                <div class="mini_card_body_top">
                    <div>
                        #${pokemon.id}
                    </div>
                    <div>
                        ${pokemon.name}
                    </div>
                    <div></div>                         
                </div>
                <div class="mini_card_body_img" id="mini_card_body_${pokemon.name}">
                    <img src="${pokemon.image}" alt="Image of ${pokemon.name}">
                </div>
                <div class="mini_card_body_bottom" id="mini_card_icon_${pokemon.name}">
                </div>                    
            </div>
        `;
}

function detailCardTemplate(pokemon, pokemonAbilities) {
    return `    
            <div class="card_body">
                <div onclick="logDownWithBubblingPrevention(event)" class="detail_card_body">
                    <div class="detail_card_body_top">
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
                    <div class="detail_card_body_img" id="detail_card_body_${pokemon.name}">
                        <img class="pokemonImage" src="${pokemon.image}" alt="Image of ${pokemon.name}">
                    </div>
                    <div class="detail_card_icon_body" id="detail_card_icon">                 
                    </div>
                    
                    <div class="details_block">
                        <div class="nav">
                            <button class="detail_btn" onclick="showMainDetails('${pokemon.name}')">
                                main
                            </button>
                            <button class="detail_btn" onclick="showStatsDetails('${pokemon.name}')">
                                stats
                            </button>
                            <button class="detail_btn" onclick="showEvoChainDetails('${pokemon.name}')">
                                Evo chain
                            </button>
                        </div>                        
                        <div class="detail_content" id="detail_content">
                            <div class="details">
                                <div class="detail_properties">
                                    Height
                                </div> 
                                <div>
                                    : ${(pokemon.height / 10).toFixed(2).replace(".", ",") } m
                                </div>
                            </div>
                            <div class="details">
                                <div class="detail_properties">
                                    Weight
                                </div>
                                <div>
                                    : ${(pokemon.weight / 10).toFixed(2).replace(".", ",")} kg
                                </div>
                            </div>
                            <div class="details">
                                <div class="detail_properties">
                                    Base_experience
                                </div>
                                <div>
                                    : ${pokemon.baseExperience}
                                </div>
                            </div>
                            <div class="details">
                                <div class="detail_properties">
                                    Abilities
                                </div>
                                <div>
                                    : ${pokemonAbilities.join(", ") }
                                </div>
                            </div>
                            <div class="details">                                
                                <div>
                                    <br>${pokemon.flavortext.replace("\f", "") }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="detail_card_body_bottom">
                        <img onclick="overlayOn('${getNextPokemonName(pokemon.name, -1)}')" 
                            class="arrows_icons" src="./img/icons/arrows_left_red.png" title="back">                        
                        <img onclick="overlayOn('${getNextPokemonName(pokemon.name, 1)}')" 
                            class="arrows_icons" src="./img/icons/arrows_right_red.png" title="next">
                    </div>                    
                </div>
            </div>
        `;
}

function loadingSpinnerTemplate() {
    return `
                <div class="spinner_img">
                    <img src="./img/superball.png" alt="">
                    
                </div>
                <div class="loading_text">
                    load Pokemons...
                </div>
            `;    
}

function mainDetailsTemplate(pokemon, pokemonAbilities) {
    return `
                <div class="details">
                    <div class="detail_properties">
                        Height
                    </div>
                    <div>
                        : ${(pokemon.height / 10).toFixed(2).replace(".", ",") } m
                    </div>
                </div>
                <div class="details">
                    <div class="detail_properties">
                        Weight
                    </div>
                    <div>
                        : ${(pokemon.weight / 10).toFixed(2).replace(".", ",")} kg
                    </div>
                </div>
                <div class="details">
                    <div class="detail_properties">
                        Base_experience
                    </div>
                    <div>
                        : ${pokemon.baseExperience}
                    </div>
                </div>
                <div class="details">
                    <div class="detail_properties">
                        Abilities
                    </div>
                    <div>
                        : ${pokemonAbilities.join(", ") }
                    </div>
                </div>
                <div class="details">
                    <div>
                        <br>${pokemon.flavortext.replace("\f", "") }
                    </div>
                </div>
            `;
}

function evoChainTemplate(selectedPokemon) {
    // Erstelle die Bild-URLs für jedes Pokémon in der Evolution
    let getPokemonImage = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;  

    

    // Hier wird immer die vollständige Kette angezeigt, unabhängig vom ausgewählten Pokémon
    return `
        <div class="evo-chain">
            <!-- Erstes Pokémon in der Evolution -->
            <div>
                
            </div>
            <div>
                >>
            </div>   
            <!-- Zweites Pokémon in der Evolution, falls vorhanden -->
            <div>
                
            </div>
            <div>
                >>
            </div> 
            <!-- Drittes Pokémon in der Evolution, falls vorhanden -->
            <div>
                
            </div>                    
        </div>
            `;
}

