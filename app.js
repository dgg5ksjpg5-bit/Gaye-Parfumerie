/* =========================================================
   GAYE PARFUMERIE - APPLICATION PRINCIPALE
========================================================= */


/* =========================================================
   FAVORIS
========================================================= */

function recupererFavoris() {

    const donnees = localStorage.getItem("gayeFavoris");

    if (!donnees) {
        return [];
    }

    try {

        const favoris = JSON.parse(donnees);

        if (Array.isArray(favoris)) {
            return favoris.map(Number);
        }

    } catch (erreur) {

        console.error("Erreur favoris :", erreur);

    }

    return [];
}


/* =========================================================
   SAUVEGARDER FAVORIS
========================================================= */

function sauvegarderFavoris(favoris) {

    localStorage.setItem(
        "gayeFavoris",
        JSON.stringify(favoris)
    );

}


/* =========================================================
   VERIFIER FAVORI
========================================================= */

function produitEstFavori(id) {

    id = Number(id);

    const favoris = recupererFavoris();

    return favoris.includes(id);

}


/* =========================================================
   AJOUTER / RETIRER FAVORI
========================================================= */

function basculerFavori(id) {

    id = Number(id);

    let favoris = recupererFavoris();


    if (favoris.includes(id)) {

        /* RETIRER */

        favoris = favoris.filter(function (favori) {

            return favori !== id;

        });

    } else {

        /* AJOUTER */

        favoris.push(id);

    }


    sauvegarderFavoris(favoris);

    mettreAJourBoutonsFavoris();


    /* Si nous sommes sur la page favoris */

    if (
        window.location.pathname.toLowerCase().includes("favoris.html")
    ) {

        if (typeof afficherFavoris === "function") {

            afficherFavoris();

        }

    }

}


/* =========================================================
   METTRE A JOUR TOUS LES COEURS
========================================================= */

function mettreAJourBoutonsFavoris() {

    const boutons =
        document.querySelectorAll(".favorite-btn");


    boutons.forEach(function (bouton) {

        const id = Number(
            bouton.getAttribute("data-id")
        );


        if (produitEstFavori(id)) {

            bouton.innerHTML = "♥";

            bouton.classList.add("active");

            bouton.setAttribute(
                "title",
                "Retirer des favoris"
            );

            bouton.setAttribute(
                "aria-label",
                "Retirer des favoris"
            );

        } else {

            bouton.innerHTML = "♡";

            bouton.classList.remove("active");

            bouton.setAttribute(
                "title",
                "Ajouter aux favoris"
            );

            bouton.setAttribute(
                "aria-label",
                "Ajouter aux favoris"
            );

        }

    });

}


/* =========================================================
   MENU MOBILE
========================================================= */

function initialiserMenu() {

    const menuToggle =
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector(".nav");


    if (!menuToggle || !nav) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

            nav.classList.toggle("active");

        }
    );

}


/* =========================================================
   RECHERCHE
========================================================= */

function ouvrirRecherche() {

    let overlay =
        document.querySelector(".search-overlay");


    /* Si l'overlay existe déjà, on l'affiche */

    if (overlay) {

        overlay.classList.add("show");

        const input =
            overlay.querySelector(
                "#global-search, #searchInput"
            );

        if (input) {
            setTimeout(function () {
                input.focus();
            }, 100);
        }

        return;

    }


    overlay =
        document.createElement("div");

    overlay.className =
        "search-overlay";


    overlay.innerHTML = `

        <div class="search-box">

            <button
                type="button"
                class="search-close"
                onclick="fermerRecherche()"
            >
                ×
            </button>

            <div class="search-label">
                RECHERCHE
            </div>

            <h2>
                Trouvez votre fragrance
            </h2>

            <form
                class="global-search-form"
                onsubmit="effectuerRecherche(event)"
            >

                <div class="global-search-input">

                    <span>⌕</span>

                    <input
                        type="text"
                        id="global-search"
                        placeholder="Rechercher un parfum..."
                        autocomplete="off"
                    >

                </div>

                <button
                    type="submit"
                    class="btn btn-primary"
                >
                    Rechercher
                </button>

            </form>

            <p class="search-help">
                Exemple : Kayali, My Way, Black Opium...
            </p>

        </div>

    `;


    document.body.appendChild(overlay);


    setTimeout(function () {

        overlay.classList.add("show");

    }, 10);


    setTimeout(function () {

        const input =
            document.getElementById("global-search");

        if (input) {
            input.focus();
        }

    }, 100);

}


/* =========================================================
   FERMER RECHERCHE
========================================================= */

function fermerRecherche() {

    const overlay =
        document.querySelector(".search-overlay");


    if (!overlay) {
        return;
    }


    overlay.classList.remove("show");


    /* Ne supprime pas l'overlay s'il appartient à la page */

    if (
        overlay.id === "searchOverlay"
    ) {

        return;

    }


    setTimeout(function () {

        if (overlay.parentNode) {

            overlay.remove();

        }

    }, 250);

}


/* =========================================================
   EFFECTUER RECHERCHE
========================================================= */

function effectuerRecherche(event) {

    if (event) {
        event.preventDefault();
    }


    const input =
        document.getElementById("global-search") ||
        document.getElementById("searchInput");


    if (!input) {
        return;
    }


    const recherche =
        input.value.trim();


    if (recherche === "") {

        alert(
            "Veuillez entrer le nom d'un parfum."
        );

        input.focus();

        return;

    }


    window.location.href =
        "boutique.html?recherche=" +
        encodeURIComponent(recherche);

}


/* =========================================================
   VOIR PRODUIT
========================================================= */

function voirProduit(id) {

    window.location.href =
        "produit.html?id=" + Number(id);

}


/* =========================================================
   AJOUTER DEPUIS ACCUEIL
========================================================= */

function ajouterProduitAccueil(id) {

    if (
        typeof ajouterAuPanier === "function"
    ) {

        ajouterAuPanier(Number(id));

    }

}


/* =========================================================
   AJOUTER DEPUIS BOUTIQUE
========================================================= */

function ajouterProduitBoutique(id) {

    if (
        typeof ajouterAuPanier === "function"
    ) {

        ajouterAuPanier(Number(id));

    }

}


/* =========================================================
   NEWSLETTER
========================================================= */

function inscrireNewsletter(event) {

    if (event) {
        event.preventDefault();
    }


    const formulaire =
        event ? event.target : null;


    if (!formulaire) {
        return false;
    }


    const input =
        formulaire.querySelector("input[type='email']");


    if (!input) {
        return false;
    }


    if (input.value.trim() === "") {

        alert(
            "Veuillez entrer votre adresse email."
        );

        return false;

    }


    alert(
        "Merci ! Vous êtes maintenant inscrit(e) à notre newsletter."
    );


    input.value = "";


    return false;

}


/* =========================================================
   COMPTEUR PANIER
========================================================= */

function initialiserCompteurPanier() {

    if (
        typeof mettreAJourCompteurPanier === "function"
    ) {

        mettreAJourCompteurPanier();

    }

}


/* =========================================================
   ANIMATION
========================================================= */

function initialiserAnimations() {

    const elements =
        document.querySelectorAll(
            ".product-card, .category-card, .feature, .value-card"
        );


    if (
        !("IntersectionObserver" in window)
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(function (element) {

        observer.observe(element);

    });

}


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initialiserMenu();

        initialiserCompteurPanier();

        initialiserAnimations();

        mettreAJourBoutonsFavoris();


        /* Recherche */

        const searchButtons =
            document.querySelectorAll(
                ".search-btn"
            );


        searchButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    ouvrirRecherche();

                }
            );

        });


        /* Fermer recherche en cliquant
           en dehors de la boîte */

        document.addEventListener(
            "click",
            function (event) {

                const overlay =
                    document.querySelector(
                        ".search-overlay"
                    );


                if (
                    overlay &&
                    event.target === overlay
                ) {

                    fermerRecherche();

                }

            }
        );


        /* Touche Echap */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Escape") {

                    fermerRecherche();

                }

            }
        );

    }
);