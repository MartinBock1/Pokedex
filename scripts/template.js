function miniCardTemplate(pokemonMiniCardData, pokemonImage) {   
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
    pokemonMiniCardData.name = pokemonMiniCardData.name.charAt(0).toUpperCase() + pokemonMiniCardData.name.slice(1);
    return `    
            <div class="mini_card_body" onclick="on()">  
                <div class="mini_card_body_top">
                    <div>
                        #${pokemonMiniCardData.id}
                    </div>
                    <div>
                        ${pokemonMiniCardData.name}
                    </div>
                    <div></div>                         
                </div>
                <div class="mini_card_body_img" id="mini_card_body_${pokemonMiniCardData.name}">
                    <img src="${pokemonImage}" alt="Image of ${pokemonMiniCardData.name}">
                </div>
                <div class="mini_card_body_bottom" id="mini_card_icon_${pokemonMiniCardData.name}">
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
                <div class="progressImg">
                    <img src="./img/superball.png" alt="">
                </div>
            `;
    
}