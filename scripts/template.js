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
    

    return `    
            <div class="mini_card_body" onclick="on()">  
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

    return `    
            <div class="card_body">
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

function progressCircleTemplate() {
    return `
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <!-- Der Hintergrundkreis -->
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="lightgray" 
                        stroke-width="10" 
                        fill="none" 
                    />

                    <!-- Der gefüllte Teil des Kreises (Ladebalken) -->
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="red" 
                        stroke-width="10"
                        stroke-dasharray="282.6"
                        stroke-dashoffset="282.6"
                        stroke-linecap="round" 
                        fill="none" 
                        transform="rotate(-90, 50, 50)">
                            <animate attributeName="stroke-dashoffset" 
                            from="282.6"
                            to="0" 
                            dur="5s" 
                            fill="freeze"
                            calcMode="spline" 
                            keySplines="0.42 0 0.58 1"
                        />
                    </circle>
                    <!-- Der Text in der Mitte -->
                    <text x="50" y="50">
                    50%
                    </text>
                </svg>
            `;
    
}