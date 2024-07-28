import { COORDINATES } from "./coordinates.js";
import { TILE_WIDTH, TILE_HEIGHT, images } from "./images.js";

const TILE_DEPTH = 7;
const TOTAL_OFFSET_TOP = 30;
const TOTAL_OFFSET_LEFT = 80;
const TILE_ROUNDNESS = 7;

export function createTiles(options) {
    for (let counter = 0; counter < COORDINATES.length; counter++) {
        const coord = COORDINATES[counter];
        const [x, y, z] = coord;
        const image = images[counter];

        const tile = $("<div></div>")
            .addClass("tile")
            .css({
                left: x * TILE_WIDTH + TILE_DEPTH * z + TOTAL_OFFSET_LEFT + "px",
                top: y * TILE_HEIGHT + TILE_DEPTH * z + TOTAL_OFFSET_TOP + "px",
                zIndex: z,
            })
            .attr("coord", coord.toString())
            .attr("type", image.attr("type"));

        const tileFront = $("<div></div>")
            .addClass("tileFront")
            .css({
                width: TILE_WIDTH + "px",
                height: TILE_HEIGHT + "px",
                borderRadius: TILE_ROUNDNESS + "px",
            })
            .attr("coord", coord.toString())
            .click(() => {
                options.clickFunction(coord);
            })
            .append(image);

        const tileBack = $("<div></div>")
            .addClass("tileBack")
            .css({
                width: TILE_WIDTH + TILE_DEPTH + "px",
                height: TILE_HEIGHT + TILE_DEPTH + "px",
                top: -TILE_DEPTH + "px",
                left: -TILE_DEPTH + "px",
                borderRadius: `
                    ${TILE_ROUNDNESS}px
                    ${2 * TILE_DEPTH}px
                    ${TILE_ROUNDNESS}px
                    ${2 * TILE_DEPTH}px`,
            });

        tile.append(tileBack).append(tileFront).appendTo("#game");
    }
}
