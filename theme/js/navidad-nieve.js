/**
 * FotosyCaptura.cl
 * Nevada navideña 2026
 *
 * Sin dependencias externas.
 * Sin cookies ni almacenamiento.
 */

(() => {
    'use strict';

    const CONFIG = {
        count: 28,
        minSize: 8,
        maxSize: 20,
        minDuration: 12,
        maxDuration: 28,
        maxDrift: 90,
        minOpacity: 0.25,
        maxOpacity: 0.75
    };

    const SYMBOLS = ['❄', '❅', '❆', '✦'];

    const random = (min, max) =>
        Math.random() * (max - min) + min;

    function createSnowflake() {
        const flake = document.createElement('span');

        flake.className = 'christmas-snowflake';
        flake.setAttribute('aria-hidden', 'true');

        flake.textContent = SYMBOLS[
            Math.floor(Math.random() * SYMBOLS.length)
        ];

        const size = random(
            CONFIG.minSize,
            CONFIG.maxSize
        );

        const duration = random(
            CONFIG.minDuration,
            CONFIG.maxDuration
        );

        const opacity = random(
            CONFIG.minOpacity,
            CONFIG.maxOpacity
        );

        const drift = random(
            -CONFIG.maxDrift,
            CONFIG.maxDrift
        );

        flake.style.left = `${random(0, 100)}%`;
        flake.style.fontSize = `${size}px`;

        flake.style.animationDuration =
            `${duration}s`;

        // Distribuir copos por toda la pantalla
        flake.style.animationDelay =
            `${random(-duration, 0)}s`;

        flake.style.setProperty(
            '--snow-opacity',
            opacity
        );

        flake.style.setProperty(
            '--snow-drift',
            `${drift}px`
        );

        return flake;
    }

    function initSnowfall() {

        // Evitar duplicar la nevada
        if (document.querySelector('.christmas-snow')) {
            return;
        }

        // Respetar preferencias de accesibilidad
        const motion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );

        if (motion.matches) {
            return;
        }

        const container = document.createElement('div');

        container.className = 'christmas-snow';
        container.setAttribute('aria-hidden', 'true');

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < CONFIG.count; i++) {
            fragment.appendChild(createSnowflake());
        }

        container.appendChild(fragment);
        document.body.appendChild(container);

        // Si cambia la preferencia de movimiento,
        // retirar la animación.
        motion.addEventListener('change', event => {
            if (event.matches) {
                container.remove();
            } else {
                initSnowfall();
            }
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initSnowfall,
            { once: true }
        );
    } else {
        initSnowfall();
    }

})();
