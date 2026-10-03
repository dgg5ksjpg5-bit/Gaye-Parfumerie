/* =========================================================
   GAYE PARFUMERIE
   SYSTÈME DU PANIER
   ========================================================= */


/* =========================================================
   RÉCUPÉRER LE PANIER
   ========================================================= */

function recupererPanier() {

    const panierSauvegarde = localStorage.getItem("gayePanier");

    if (!panierSauvegarde) {
        return [];
    }

    try {

        return JSON.parse(panierSauvegarde);

    } catch (erreur) {

        console.log("Erreur lors de la lecture du panier.");

        return [];

    }

}


/* =========================================================
   SAUVEGARDER LE PANIER
   ========================================================= */

function sauvegarderPanier(panier) {

    localStorage.setItem(
        "gayePanier",
        JSON.stringify(panier)
    );

}


/* =========================================================
   AJOUTER AU PANIER
   ========================================================= */

function ajouterAuPanier(idProduit) {

    const produit = produits.find(function (article) {

        return article.id === idProduit;

    });


    if (!produit) {

        console.log("Produit introuvable.");

        return;

    }


    const panier = recupererPanier();


    const articleExistant = panier.find(function (article) {

        return article.id === idProduit;

    });


    if (articleExistant) {

        articleExistant.quantite += 1;

    } else {

        panier.push({

            id: produit.id,

            nom: produit.nom,

            prix: produit.prix,

            image: produit.image,

            quantite: 1

        });

    }


    sauvegarderPanier(panier);

    mettreAJourCompteurPanier();

    afficherMessageAjout(produit.nom);

}


/* =========================================================
   SUPPRIMER UN PRODUIT
   ========================================================= */

function supprimerDuPanier(idProduit) {

    let panier = recupererPanier();


    panier = panier.filter(function (article) {

        return article.id !== idProduit;

    });


    sauvegarderPanier(panier);

    afficherPanier();

    mettreAJourCompteurPanier();

}


/* =========================================================
   AUGMENTER LA QUANTITÉ
   ========================================================= */

function augmenterQuantite(idProduit) {

    const panier = recupererPanier();


    const article = panier.find(function (element) {

        return element.id === idProduit;

    });


    if (article) {

        article.quantite += 1;

    }


    sauvegarderPanier(panier);

    afficherPanier();

    mettreAJourCompteurPanier();

}


/* =========================================================
   DIMINUER LA QUANTITÉ
   ========================================================= */

function diminuerQuantite(idProduit) {

    const panier = recupererPanier();


    const article = panier.find(function (element) {

        return element.id === idProduit;

    });


    if (!article) {
        return;
    }


    article.quantite -= 1;


    if (article.quantite <= 0) {

        supprimerDuPanier(idProduit);

        return;

    }


    sauvegarderPanier(panier);

    afficherPanier();

    mettreAJourCompteurPanier();

}


/* =========================================================
   CALCULER LE TOTAL
   ========================================================= */

function calculerTotalPanier() {

    const panier = recupererPanier();

    let total = 0;


    panier.forEach(function (article) {

        total += article.prix * article.quantite;

    });


    return total;

}


/* =========================================================
   FORMATER LE PRIX
   ========================================================= */

function formaterPrix(prix) {

    return prix.toLocaleString("fr-FR") + " FCFA";

}


/* =========================================================
   AFFICHER LE COMPTEUR
   ========================================================= */

function mettreAJourCompteurPanier() {

    const compteur = document.querySelector(".cart-count");

    if (!compteur) {
        return;
    }


    const panier = recupererPanier();

    let quantiteTotale = 0;


    panier.forEach(function (article) {

        quantiteTotale += article.quantite;

    });


    compteur.textContent = quantiteTotale;

}


/* =========================================================
   MESSAGE APRÈS AJOUT
   ========================================================= */

function afficherMessageAjout(nomProduit) {

    const ancienMessage =
        document.querySelector(".cart-notification");


    if (ancienMessage) {

        ancienMessage.remove();

    }


    const notification =
        document.createElement("div");


    notification.className =
        "cart-notification";


    notification.textContent =
        nomProduit + " a été ajouté au panier";


    document.body.appendChild(notification);


    setTimeout(function () {

        notification.classList.add("show");

    }, 10);


    setTimeout(function () {

        notification.classList.remove("show");


        setTimeout(function () {

            notification.remove();

        }, 300);

    }, 2500);

}


/* =========================================================
   AFFICHER LE PANIER
   ========================================================= */

function afficherPanier() {

    const conteneur =
        document.querySelector(".cart-products");


    if (!conteneur) {
        return;
    }


    const panier = recupererPanier();


    if (panier.length === 0) {

        conteneur.innerHTML = `

            <div class="cart-empty">

                <div class="cart-empty-icon">
                    🛍
                </div>

                <h2>
                    Votre panier est vide
                </h2>

                <p>
                    Découvrez notre collection et trouvez
                    votre prochaine signature.
                </p>

                <a href="boutique.html" class="btn btn-primary">
                    Découvrir la boutique
                </a>

            </div>

        `;


        mettreAJourResumePanier();

        return;

    }


    conteneur.innerHTML = "";


    panier.forEach(function (article) {

        const sousTotal =
            article.prix * article.quantite;


        const element =
            document.createElement("div");


        element.className = "cart-item";


        element.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${article.image}"
                    alt="${article.nom}"
                >

            </div>


            <div class="cart-item-info">

                <span>
                    GAYE PARFUMERIE
                </span>

                <h3>
                    ${article.nom}
                </h3>

                <p>
                    ${formaterPrix(article.prix)}
                </p>

            </div>


            <div class="cart-quantity">

                <button
                    onclick="diminuerQuantite(${article.id})"
                    aria-label="Diminuer"
                >
                    −
                </button>

                <strong>
                    ${article.quantite}
                </strong>

                <button
                    onclick="augmenterQuantite(${article.id})"
                    aria-label="Augmenter"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">

                ${formaterPrix(sousTotal)}

            </div>


            <button
                class="remove-cart"
                onclick="supprimerDuPanier(${article.id})"
                aria-label="Supprimer"
            >
                ×
            </button>

        `;


        conteneur.appendChild(element);

    });


    mettreAJourResumePanier();

}


/* =========================================================
   RÉSUMÉ DU PANIER
   ========================================================= */

function mettreAJourResumePanier() {

    const panier =
        recupererPanier();


    const sousTotal =
        calculerTotalPanier();


    const elementSousTotal =
        document.querySelector(".cart-subtotal");


    const elementTotal =
        document.querySelector(".cart-total");


    if (elementSousTotal) {

        elementSousTotal.textContent =
            formaterPrix(sousTotal);

    }


    if (elementTotal) {

        elementTotal.textContent =
            formaterPrix(sousTotal);

    }

}


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        mettreAJourCompteurPanier();

        afficherPanier();

    }
);