// Add your code here
namespace waypoint {
    const SPRITE_KIND_WAYPOINT = SpriteKind.create()
    const IMAGE_WAYPOINT = img`
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
        3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
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

    let epsilon = 2


    function distanceOf(sprite:Sprite, otherSprite:Sprite):number {
        return Math.sqrt(Math.pow(sprite.x - otherSprite.x, 2) + Math.pow(sprite.y - otherSprite.y, 2))
    }

    function closeEnough(sprite:Sprite, otherSprite:Sprite) {
        return distanceOf(sprite, otherSprite) < epsilon
    }

    function speedOf(sprite:Sprite) :number{
        return Math.sqrt(Math.pow(sprite.vx, 2) + Math.pow(sprite.vy, 2))
    }

    function movingDirectionOf(sprite:Sprite): Direction {
        if (sprite.vx == 0 && sprite.vy < 0) {
            return Direction.UP
        } else if (sprite.vx > 0 && sprite.vy == 0) {
            return Direction.RIGHT 
        } else if (sprite.vx == 0 && sprite.vy > 0) {
            return Direction.DOWN 
        } else {
            return Direction.LEFT
        }
    }

    let _showWaypoints = false;

    //%block
    export function showWaypoints(show:boolean) {
        _showWaypoints = show
        for (let waypointSprite of sprites.allOfKind(SPRITE_KIND_WAYPOINT)) {
            waypointSprite.setFlag(SpriteFlag.Invisible, !show)
        }
    }

    let registered:SparseArray<boolean> = {}

    //%block
    //% blockId=waypointPlaceWaypoint block="place waypoint on $location to make %kind=spritekind turn to %direction"
    //% location.shadow=mapgettile
    export function placeWaypoint(location:tiles.Location, kind:number, direction:Direction) {
        let waypointSprite = sprites.create(IMAGE_WAYPOINT, SPRITE_KIND_WAYPOINT)
        sprites.setDataNumber(waypointSprite, 'pxt-waypoint-direction', direction)
        sprites.setDataNumber(waypointSprite, 'pxt-waypoint-kind', kind)
        waypointSprite.setFlag(SpriteFlag.Invisible, !_showWaypoints)
        tiles.placeOnTile(waypointSprite, location)
        if (!registered[kind]) {
            registered[kind] = true
            sprites.onOverlap(SPRITE_KIND_WAYPOINT, kind, function(sprite: Sprite, otherSprite: Sprite) {
                let kind = sprites.readDataNumber(sprite, 'pxt-waypoint-kind')
                if (otherSprite.kind() != kind) {
                    // not target sprite kind
                    return
                }

                if (!closeEnough(sprite, otherSprite) || speedOf(otherSprite) == 0) {
                    // not in center
                    return 
                }

                let direction:Direction = sprites.readDataNumber(sprite, 'pxt-waypoint-direction')

                if (movingDirectionOf(otherSprite) === direction) {
                    return
                }

                const speed = speedOf(otherSprite)
                if (distanceOf(sprite, otherSprite) != 0) {
                    otherSprite.x = sprite.x 
                    otherSprite.y = sprite.y
                }
                

                if (direction == Direction.UP && !otherSprite.isHittingTile(CollisionDirection.Top)) {
                    otherSprite.vy = 0 - speed
                    otherSprite.vx = 0
                } else if (direction == Direction.RIGHT && !otherSprite.isHittingTile(CollisionDirection.Right)) {
                    otherSprite.vx = speed
                    otherSprite.vy = 0
                } if (direction == Direction.DOWN && !otherSprite.isHittingTile(CollisionDirection.Bottom)) {
                    otherSprite.vy = speed
                    otherSprite.vx = 0
                } if (direction == Direction.LEFT && !otherSprite.isHittingTile(CollisionDirection.Left)) {
                    otherSprite.vx = 0 - speed
                    otherSprite.vy = 0
                } 
            })
        }
        

    }
    

}
