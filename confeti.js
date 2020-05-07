import {Piece, randomColor, randomFromRange} from "./utils.js";

const confetti = (element,
                  {
                      pieces = 50,
                      infinite = false,
                      left = false,
                      right = false,
                      top = true,
                      center = false
                  } = {}) => {

    /// init elements
    const canvas = document.createElement('canvas');

    const {height, width, top: _top, left: _left} = element.getBoundingClientRect();

    const container = document.createElement('div');

    // set style to the container
    container.style.height = height + 'px';
    container.style.width = width + 'px';
    container.style.top = _top + 'px';
    container.style.left = _left + 'px';
    container.style.position = 'absolute';

    // set canvas on top of the container
    canvas.height = height;
    canvas.width = width;

    container.append(canvas);

    document.body.append(container);

    // init confetti data;

    const ctx = canvas.getContext('2d');

    let _cancelAnimationFrame = 0;
    /**
     * @type {Piece[]}
     */
    let piece = []; //initData(pieces, canvas, ctx, op);

    let _isRunning = true;


    /**
     * Update the elements (reduce if needed)
     * Only if isInfinite
     * @param isInfinite
     */
    function update({isInfinite = false} = {}) {
        piece.forEach((p, i) => {
            if (p.y > canvas.height && !isInfinite) {
                piece.splice(i, 1);
            }
        });

        if (_isRunning) setTimeout(update.bind(null, {infinite}), 60);
    }

    /**
     * Draw the confetti on the canvas
     * @param ctx
     * @param canvas
     * @param piece
     * @param isInfinite
     */
    function draw(ctx, canvas, piece, isInfinite) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        piece.forEach((p, i) => {
            p.draw(isInfinite);
        });

        if (_isRunning) {
            _cancelAnimationFrame = requestAnimationFrame(draw.bind(null, ctx, canvas, piece, isInfinite));
        }

        if (piece.length === 0) _isRunning = false;
    }


    /**
     * Start the animation
     * Cancel the requestAnimation and restart it
     */
    function start() {
        _isRunning = false;

        if (!infinite) piece = initData(pieces, canvas, ctx, {top, left, right, center});

        cancelAnimationFrame(_cancelAnimationFrame);

        function __init() {
            _isRunning = true;
            infinite && update({infinite});
            draw(ctx, canvas, piece, infinite);
        }

        setTimeout(__init, 30);
    }

    return {
        top: () => {
            right = false;
            left = false;
            center = false;
            top = true;
            start();
        },
        start,
        pause: () => {
            _isRunning = false
        },
        left: () => {
            left = true;
            right = false;
            center = false;
            start();
        },
        right: () => {
            right = true;
            left = false;
            center = false;
            start();
        },
        center: () => {
            right = false;
            left = false;
            center = true
            start();
        }
    }

};

function initData(pieces, canvas, ctx, options = {}) {
    /**
     * @type {Piece[]}
     */
    const piece = [];
    let func;
    switch (true) {
        case options.center:
            func = addPieceTwoSides(canvas, ctx);
            break;
        case options.left:
            func = addPieceLeft(canvas, ctx);
            break;
        case options.right:
            func = addPieceRight(canvas, ctx);
            break;
        case options.top:
        default:
            func = addPieceTop(canvas, ctx);
            break;
    }
    while (piece.length < pieces) {
        piece.push(func(piece.length))
    }

    return piece;
}

function addPieceTop(canvas, ctx) {
    return (length) => {
        return new Piece({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            canvas,
            ctx,
            top: true
        })
    }
}

function addPieceLeft(canvas, ctx) {
    return (length) => {
        return new Piece({
            x: canvas.width,
            y: randomFromRange(canvas.height * 0.3, canvas.height * 0.6),
            canvas,
            ctx,
            left: true
        })
    }
}

function addPieceRight(canvas, ctx) {
    return (length) => {
        return new Piece({
            x: 0,
            y: randomFromRange(canvas.height * 0.3, canvas.height * 0.6),
            canvas,
            ctx,
            right: true
        })
    }
}

function addPieceTwoSides(canvas, ctx) {
    return (length) => {
        const right = length % 2 === 0 ;
        const left = !right;
        return new Piece({
            x: canvas.width / 2,
            y: canvas.height / 2,
            canvas,
            ctx,
            right,
            left
        })
    }

}

export default confetti;

