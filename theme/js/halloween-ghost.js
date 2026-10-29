/**
 * Halloween Ghost - FotosYCaptura
 *
 * Un fantasma que ocasionalmente sufre
 * una crisis de identidad paranormal.
 *
 * Probabilidad de mutación: 5 %
 */

document.addEventListener('DOMContentLoaded', () => {

    const ghost = document.querySelector('.halloween-ghost');

    if (!ghost) return;

    const emojis = [
        '🦖', '🦆', '💩', '🗿', '🤡',
        '🦈', '🛸', '🐔', '🐙', '👽'
    ];

    const MUTATION_PROBABILITY = 0.35;

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    if (reducedMotion.matches) return;

    /**
     * Decide la identidad del fantasma
     * para el siguiente recorrido.
     */
    function mutateGhost() {

        const mutation = Math.random() < MUTATION_PROBABILITY;

        if (mutation) {

            const randomIndex = Math.floor(
                Math.random() * emojis.length
            );

            ghost.textContent = emojis[randomIndex];

            console.debug(
                '[Halloween] Mutación paranormal:',
                ghost.textContent
            );

        } else {

            ghost.textContent = '👻';

        }
    }

    // Primera aparición
    mutateGhost();

    /**
     * Cada vez que termina el recorrido CSS,
     * decide si el fantasma mutará.
     */
    ghost.addEventListener('animationiteration', (event) => {

        if (event.animationName === 'ghost-travel') {
            mutateGhost();
        }

    });

});
