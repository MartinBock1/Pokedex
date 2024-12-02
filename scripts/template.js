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
            <div class="mini_card_body" onclick="overlayOn('${pokemon.name}')">
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

function detailCardTemplate(pokemon, direction = null) {
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
                    <div class="detail_card_body_img" id="mini_card_body_${pokemon.name}">
                    <img class="pokemonImage" src="${pokemon.image}" alt="Image of ${pokemon.name}">
                    </div>
                    <div class="detail_card_body_bottom">
                        <img onclick="overlayOn('${getNextPokemonName(pokemon.name, -1)}')" class="arrows_icons" src="./img/icons/arrows_left_red.png" title="back">
                        
                        <img onclick="overlayOn('${getNextPokemonName(pokemon.name, 1)}')" class="arrows_icons" src="./img/icons/arrows_right_red.png" title="next">
                    </div>                    
                </div>
            </div>
        `;
}

function progressCircleTemplate() {
    return `
                <div class="progressImg">
                    <img src="./img/superball.png" alt="">
                </div>
            `;
    
}