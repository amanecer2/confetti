const colors = ['red', 'blue', 'green', 'gray', 'pink', 'purple', 'orange', 'AliceBlue', 'Azure'];


const MAX_TOP_EXCELERATION = 75;
const SIZE_FACTOR = 15;
const GRAVITY_FACTOR = 2;
const ROTATION_FACTOR = 0.1;
const ROTATION_SPEED_FACTOR = 0.01;

/**
 * Piece constructor
 * @param x
 * @param y
 * @param canvas
 * @param ctx
 * @param right
 * @param left
 * @constructor
 */
export function Piece ({x, y, canvas, ctx, right, left}) {
        this.x = x;
        this.y = y;
        this.size = (Math.random() * 0.5 + 0.75) * SIZE_FACTOR;
        this.gravity = (Math.random() * 0.5 + 0.75) *  GRAVITY_FACTOR;
        this.ratation = (Math.PI * 2) * Math.random() * ROTATION_FACTOR;
        this.rotationSpeed = (Math.PI * 2) * Math.random() * ROTATION_SPEED_FACTOR;
        this.color = randomColor();
        this.canvas = canvas;
        this.ctx = ctx;
        this.right = right;
        this.left = left;

        this._isPeak = false;
        this._upPoints = 0;
        this._upPointsMAx = MAX_TOP_EXCELERATION;
        this._easeOutQuadNormalize = easeOutCircNormalize(this._upPointsMAx, 0);
}

/**
 * Update piece positions
 * @param isInfinite
 */
Piece.prototype.update = function(isInfinite = false) {
     if(this.y > this.canvas.height) {
            if (isInfinite) {
                this.y = - (this.size);
                this.x = Math.random() * this.canvas.width;
                this.color = randomColor();
            }
            return;
        }

     switch (true) {
         case (this.right || this.left) && !this._isPeak:
             const _easeOutQuadNormalize = this._easeOutQuadNormalize(this._upPoints);
             this.y -= this.gravity * _easeOutQuadNormalize * 3;
             this._upPoints++;
             break
        }

        // stop going upward
        if (this._upPoints > this._upPointsMAx) {
            this._isPeak = true;
        }

        // add momentum to the sides
        if (this.right && !this._isPeak) this.x += this.gravity * 0.8;
        if (this.left && !this._isPeak) this.x -= this.gravity * 0.8;
        if (this.left && this._isPeak) this.x -= this.gravity * 0.3;
        if (this.right && this._isPeak) this.x += this.gravity * 0.3;

        // add gravity to the piece
        this.y += this.gravity;
        this.ratation += this.rotationSpeed;

};

/**
 * Draw the piece on the canvas
 * @param isInfinite
 */
Piece.prototype.draw = function (isInfinite) {
    this.update(isInfinite);

    this.ctx.save();

    this.ctx.fillStyle = this.color;
    this.ctx.translate(this.x + this.size / 2, this.y + this.size / 2)
    this.ctx.rotate(this.ratation);

    this.ctx.fillRect(-this.size / 2, this.size / 2, this.size, this.size)
    this.ctx.restore();
}
/**
 * Get random color
 * @returns {string}
 */
export function randomColor(num = Math.random()) {
    return colors[Math.floor( num * colors.length)]
}

/**
 *
 * @param min
 * @param max
 * @returns {function(number): number}
 */
function easeOutQuadNormalize(min, max) {
    return (value) => {
        return easeOutQuad((value - min) / (max - min))
    }
}

/**
 * easeOut for piece going up
 * @param min
 * @param max
 * @returns {function(number): number}
 */
function easeOutCircNormalize(min, max) {
    return (value) => {
        return easeOutCirc((value - min) / (max - min))
    }
}

function easeOutCirc(x){
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}

function norm(value, min, max) {

    return (value - min) / (max - min);
}

/**
 * Get random number
 * @param min
 * @param max
 * @returns {*}
 */
export function randomFromRange(min, max) {
    return Math.random() * (max - min + 1) + min
}