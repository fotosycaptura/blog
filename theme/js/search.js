import Fuse from "./fuse.js";

"use strict";

document.addEventListener("DOMContentLoaded", async function () {

    const searchInput =
        document.getElementById("search-input");

    const searchResults =
        document.getElementById("search-results");

    const searchStatus =
        document.getElementById("search-status");

    /*
     * Si estamos en una página que no contiene
     * buscador, no hacemos nada.
     */
    if (!searchInput || !searchResults) {
        return;
    }

    let fuse = null;

    try {

        /*
         * SITEURL se pasa desde el HTML usando
         * data-search-index.
         */
        const searchUrl =
            searchInput.dataset.searchIndex;

        const response =
            await fetch(searchUrl);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const articles =
            await response.json();

        /*
         * Configuración de Fuse.
         */
        const options = {

            /*
             * true permite obtener score.
             * Cuanto menor el score, mejor.
             */
            includeScore: true,

            /*
             * Tolerancia de coincidencia fuzzy.
             *
             * 0   = exacta
             * 1   = extremadamente permisiva
             *
             * 0.3 suele funcionar bastante bien
             * para búsquedas técnicas.
             */
            threshold: 0.3,

            /*
             * Evitamos que Fuse penalice demasiado
             * términos encontrados lejos del comienzo.
             */
            ignoreLocation: true,

            /*
             * Longitud mínima antes de buscar.
             */
            minMatchCharLength: 2,

            /*
             * Campos que buscamos y su importancia.
             */
            keys: [
                {
                    name: "title",
                    weight: 0.45
                },
                {
                    name: "tags",
                    weight: 0.25
                },
                {
                    name: "category",
                    weight: 0.15
                },
                {
                    name: "summary",
                    weight: 0.10
                },
                {
                    name: "content",
                    weight: 0.05
                }
            ]
        };

        fuse = new Fuse(
            articles,
            options
        );

        if (searchStatus) {
            searchStatus.textContent =
                `${articles.length} artículos indexados`;
        }

    } catch (error) {

        console.error(
            "Error cargando índice de búsqueda:",
            error
        );

        if (searchStatus) {
            searchStatus.textContent =
                "No fue posible cargar el buscador.";
        }

        return;
    }


    /*
     * Evento de búsqueda.
     */
    searchInput.addEventListener(
        "input",
        function () {

            const query =
                searchInput.value.trim();

            /*
             * Limpiamos resultados anteriores.
             */
            searchResults.innerHTML = "";

            if (query.length < 2) {

                if (searchStatus) {
                    searchStatus.textContent =
                        "Escribe al menos 2 caracteres.";
                }

                return;
            }

            /*
             * Máximo 20 resultados.
             */
            const results =
                fuse.search(query, {
                    limit: 20
                });

            if (results.length === 0) {

                if (searchStatus) {
                    searchStatus.textContent =
                        `No se encontraron resultados para "${query}".`;
                }

                return;
            }

            if (searchStatus) {

                const texto =
                    results.length === 1
                        ? "resultado"
                        : "resultados";

                searchStatus.textContent =
                    `${results.length} ${texto}`;
            }

            /*
             * Construimos los resultados.
             */
            results.forEach(
                function (result) {

                    const article =
                        result.item;

                    const element =
                        createResultElement(article);

                    searchResults.appendChild(
                        element
                    );
                }
            );
        }
    );
});


function createResultElement(article) {

    const result =
        document.createElement("article");

    result.className =
        "search-result";

    /*
     * Título
     */
    const title =
        document.createElement("h2");

    title.className =
        "search-result-title";

    const link =
        document.createElement("a");

    /*
     * La URL del índice normalmente es relativa.
     */
    link.href =
        makeArticleUrl(article.url);

    link.textContent =
        article.title;

    title.appendChild(link);

    result.appendChild(title);


    /*
     * Metadata
     */
    const metadata =
        document.createElement("div");

    metadata.className =
        "search-result-meta";

    const metadataParts = [];

    if (article.date) {

        const date =
            new Date(article.date);

        if (!Number.isNaN(date.getTime())) {

            metadataParts.push(
                date.toLocaleDateString(
                    "es-CL",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                )
            );
        }
    }

    if (article.category) {
        metadataParts.push(
            article.category
        );
    }

    metadata.textContent =
        metadataParts.join(" · ");

    result.appendChild(metadata);


    /*
     * Resumen
     */
    if (article.summary) {

        const summary =
            document.createElement("p");

        summary.className =
            "search-result-summary";

        summary.textContent =
            truncate(
                article.summary,
                280
            );

        result.appendChild(summary);
    }


    /*
     * Tags
     */
    if (
        Array.isArray(article.tags) &&
        article.tags.length > 0
    ) {

        const tags =
            document.createElement("div");

        tags.className =
            "search-result-tags";

        article.tags.forEach(
            function (tag) {

                const item =
                    document.createElement("span");

                item.className =
                    "search-result-tag";

                item.textContent =
                    tag;

                tags.appendChild(item);
            }
        );

        result.appendChild(tags);
    }

    return result;
}


function makeArticleUrl(url) {

    /*
     * Si ya es absoluta, la dejamos.
     */
    if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("/")
    ) {
        return url;
    }

    /*
     * Desde /buscar/ debemos subir un nivel.
     */
    return "../" + url;
}


function truncate(text, maxLength) {

    if (!text) {
        return "";
    }

    if (text.length <= maxLength) {
        return text;
    }

    return (
        text.substring(
            0,
            maxLength
        ).trim() + "…"
    );
}
