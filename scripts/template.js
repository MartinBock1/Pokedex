function miniCardTemplate(pokemon, firstLevelDetails, secondLevelDetails, pokemonIconNames) {
    /** pokemonName firstCahr uppercase
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
    pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    pokemonImage = firstLevelDetails.sprites.other.home.front_default;
    

    return `    <div class="mini_card_body" onclick="on()">  
                    <div class="mini_card_body_top">
                        <div>
                            #${firstLevelDetails.id}
                        </div>
                        <div>
                            ${pokemonName}
                        </div>
                        <div></div>                         
                    </div>
                    <div class="mini_card_body_img" id="mini_card_body_${pokemon.name}">
                        <img src="${pokemonImage}" alt="Image of ${pokemonName}">
                    </div>
                    <div class="mini_card_body_bottom" id="mini_card_icon_${pokemon.name}">
                    </div>                    
            </div>
        `;
}

function detailCardTemplate() {

    return `    <div class="card_body">
                    <div class="detail_card_body">  
                        <div class="detail_card_body_top">
                            <div>
                                top
                            </div>
                            <div>
                                middle
                            </div>
                            <div>
                                bottom
                            </div>                         
                        </div>
                        <div class="detail_card_body_img">
                            Image
                        </div>
                        <div class="detail_card_body_bottom">
                            bottom
                        </div>                    
                    </div>
                </div>
            `;
}