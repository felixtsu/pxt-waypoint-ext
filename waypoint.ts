// Add your code here
namespace waypoint {
    const SPRITE_KIND_WAYPOINT = SpriteKind.create()
    const IMAGE_WAYPOINT = img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . 3 3 . . . . . . .
                . . . . . . . 3 3 . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `

    export enum Direction{
        UP = 1, 
        RIGHT = 2, 
        DOWN = 4,
        LEFT = 8
    }

    function turnSpriteRight(sprite:Sprite) {
        if (sprite.vx != 0) {
            sprite.vy = sprite.vx
            sprite.vx = 0
        } else {
            sprite.vx = 0 - sprite.vy
            sprite.vy = 0
        }
    }

    function turnSpriteLeft(sprite:Sprite) {
        if (sprite.vx != 0) {
            sprite.vy = 0 - sprite.vx
            sprite.vx = 0
        } else {
            sprite.vx = sprite.vy
            sprite.vy = 0
        }
    }

    let epsilon = 0.5

    function closeEnough(sprite:Sprite, otherSprite:Sprite) {
        return Math.sqrt(Math.pow(sprite.x - otherSprite.x, 2) + Math.pow(sprite.y - otherSprite.y, 2)) < 0.5
    }

    function speedOf(sprite:Sprite) :number{
        return Math.sqrt(Math.pow(sprite.vx, 2) + Math.pow(sprite.vy, 2))
    }

    let registered:SparseArray<boolean> = []

    //%block
    //% blockId=waypointPlaceWaypoint block="place waypoint on %location to make %kind=spritekind turn to %direction"
    export function placeWaypoint(location:tiles.Location, kind:number, direction:Direction) {
        let waypointSprite = sprites.create(IMAGE_WAYPOINT, SPRITE_KIND_WAYPOINT)
        sprites.setDataNumber(waypointSprite, 'pxt-waypoint-direction', direction)
        sprites.setDataNumber(waypointSprite, 'pxt-waypoint-kind', kind)
        if (!registered[kind]) {
            registered[kind] = true
            sprites.onOverlap(SPRITE_KIND_WAYPOINT, kind, function(sprite: Sprite, otherSprite: Sprite) {
                let kind = sprites.readDataNumber(sprite, 'pxt-waypoint-kind')
                if (otherSprite.kind() != kind) {
                    // not target sprite kind
                    return
                }
                if (closeEnough(sprite, otherSprite)) {
                    // not in center
                    return 
                }

                let direction:Direction = sprites.readDataNumber(sprite, 'pxt-waypoint-direction')
                if (direction == Direction.UP) {
                    otherSprite.vy = 0 - speedOf(otherSprite)
                    otherSprite.vx = 0
                } else if (direction == Direction.RIGHT) {
                    otherSprite.vx = speedOf(otherSprite)
                    otherSprite.vy = 0
                } if (direction == Direction.DOWN) {
                    otherSprite.vy = speedOf(otherSprite)
                    otherSprite.vx = 0
                } if (direction == Direction.LEFT) {
                    otherSprite.vx = 0 - speedOf(otherSprite)
                    otherSprite.vy = 0
                } 
            })
        }
        

    }
    

}