import Confetti from './confeti.js';

const elem = document.querySelector('div');

const pause = document.querySelector('#pause');
const left = document.querySelector('#left');
const right = document.querySelector('#right');
const top = document.querySelector('#top');
const center = document.querySelector('#center');


pause.addEventListener('click', () => {
    confetti.pause();
});

top.addEventListener('click', () => {
    confetti.top();
});


right.addEventListener('click', () => {
    confetti.right();
});

left.addEventListener('click', () => {
    confetti.left();
});

center.addEventListener('click', () => {
    confetti.center();
});

const confetti = Confetti(elem, {infinite: false, right: true});

