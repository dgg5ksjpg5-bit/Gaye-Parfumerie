/* =========================================================
   GAYE PARFUMERIE
   GESTION DES COMMANDES
========================================================= */


/* =========================================================
   ELEMENTS DE LA PAGE
========================================================= */

const formulaireCommande =
    document.getElementById("order-form");

const produitsResume =
    document.getElementById("summary-products");

const sousTotalResume =
    document.getElementById("summary-subtotal");

const totalResume =
    document.getElementById("summary-total");

const messageFormulaire =
    document.getElementById("form-message");


/* =========================================================
   AFFICHER LE RESUME DE LA COMMANDE
========================================================= */

function afficherResumeCommande() {

    if (!produitsResume) {
        return;
    }

    const panier = recupererPanier();


    /* =========================
       PANIER VIDE
    ========================= */

    if (panier.length === 0) {

        produitsResume.innerHTML = `

            <div class="empty-order">

                <p>
                    Votre panier est vide.
                </p>

                <a href="boutique.html">
                    Découvrir la boutique
                </a>

            </div>

        `;

        if (sousTotalResume) {

            sousTotalResume.textContent =
                "0 FCFA";

        }

        if (totalResume) {

            totalResume.textContent =
                "0 FCFA";

        }

        return;
    }


    /* =========================
       AFFICHER LES PRODUITS
    ========================= */

    produitsResume.innerHTML = "";


    panier.forEach(function (article) {

        const sousTotal =
            article.prix * article.quantite;


        const produitElement =
            document.createElement("div");


        produitElement.className =
            "summary-product";


        produitElement.innerHTML = `

            <img
                src="${article.image}"
                alt="${article.nom}"
            >

            <div class="summary-product-info">

                <h3>
                    ${article.nom}
                </h3>

                <span>
                    Quantité : ${article.quantite}
                </span>

            </div>

            <div class="summary-product-price">

                ${sousTotal.toLocaleString("fr-FR")}
                FCFA

            </div>

        `;


        produitsResume.appendChild(
            produitElement
        );

    });


    /* =========================
       CALCUL TOTAL
    ========================= */

    const total =
        calculerTotalPanier();


    if (sousTotalResume) {

        sousTotalResume.textContent =
            total.toLocaleString("fr-FR") +
            " FCFA";

    }


    if (totalResume) {

        totalResume.textContent =
            total.toLocaleString("fr-FR") +
            " FCFA";

    }

}


/* =========================================================
   AFFICHER MESSAGE
========================================================= */

function afficherMessageCommande(
    message,
    type
) {

    if (!messageFormulaire) {
        return;
    }


    messageFormulaire.textContent =
        message;


    messageFormulaire.className =
        "form-message " + type;

}


/* =========================================================
   GENERER UN NUMERO DE COMMANDE
========================================================= */

function genererNumeroCommande() {

    const maintenant =
        new Date();


    const date =
        maintenant.getFullYear() +
        "" +
        String(
            maintenant.getMonth() + 1
        ).padStart(2, "0") +
        "" +
        String(
            maintenant.getDate()
        ).padStart(2, "0");


    const nombre =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return "GP-" + date + "-" + nombre;

}


/* =========================================================
   ENREGISTRER LA COMMANDE
========================================================= */

function enregistrerCommande(
    informationsClient
) {

    const panier =
        recupererPanier();


    const total =
        calculerTotalPanier();


    const numeroCommande =
        genererNumeroCommande();


    const nouvelleCommande = {

        numero:
            numeroCommande,

        date:
            new Date().toLocaleString(
                "fr-FR"
            ),

        client:
            informationsClient,

        produits:
            panier,

        total:
            total

    };


    const anciennesCommandes =
        JSON.parse(
            localStorage.getItem(
                "gayeCommandes"
            )
        ) || [];


    anciennesCommandes.push(
        nouvelleCommande
    );


    localStorage.setItem(
        "gayeCommandes",
        JSON.stringify(
            anciennesCommandes
        )
    );


    return nouvelleCommande;

}


/* =========================================================
   VALIDATION DU FORMULAIRE
========================================================= */

if (formulaireCommande) {

    formulaireCommande.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const panier =
                recupererPanier();


            /* =========================
               VERIFIER LE PANIER
            ========================= */

            if (panier.length === 0) {

                afficherMessageCommande(
                    "Votre panier est vide. Ajoutez d'abord un parfum.",
                    "error"
                );

                return;

            }


            /* =========================
               RECUPERER LES INFORMATIONS
            ========================= */

            const nom =
                document
                    .getElementById("nom")
                    .value
                    .trim();


            const telephone =
                document
                    .getElementById("telephone")
                    .value
                    .trim();


            const ville =
                document
                    .getElementById("ville")
                    .value
                    .trim();


            const adresse =
                document
                    .getElementById("adresse")
                    .value
                    .trim();


            const paiement =
                document.querySelector(
                    'input[name="paiement"]:checked'
                );


            /* =========================
               VERIFICATION
            ========================= */

            if (
                nom === "" ||
                telephone === "" ||
                ville === "" ||
                adresse === "" ||
                !paiement
            ) {

                afficherMessageCommande(
                    "Veuillez remplir tous les champs obligatoires.",
                    "error"
                );

                return;

            }


            /* =========================
               INFORMATIONS CLIENT
            ========================= */

            const informationsClient = {

                nom:
                    nom,

                telephone:
                    telephone,

                ville:
                    ville,

                adresse:
                    adresse,

                paiement:
                    paiement.value

            };


            /* =========================
               ENREGISTRER
            ========================= */

            const commande =
                enregistrerCommande(
                    informationsClient
                );


            /* =========================
               MESSAGE DE SUCCES
            ========================= */

            afficherMessageCommande(
                "Commande " +
                commande.numero +
                " enregistrée avec succès !",
                "success"
            );


            /* =========================
               VIDER LE PANIER
            ========================= */

            localStorage.removeItem(
                "gayePanier"
            );


            mettreAJourCompteurPanier();


            /* =========================
               DESACTIVER LE BOUTON
            ========================= */

            const bouton =
                formulaireCommande.querySelector(
                    ".submit-order"
                );


            if (bouton) {

                bouton.textContent =
                    "COMMANDE ENREGISTRÉE";

                bouton.disabled = true;

            }


            /* =========================
               METTRE A JOUR LE RESUME
            ========================= */

            afficherResumeCommande();


            /* =========================
               ALLER A LA PAGE
               DE CONFIRMATION
            ========================= */

            setTimeout(function () {

                window.location.href =
                    "confirmation.html";

            }, 1000);

        }
    );

}


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        afficherResumeCommande();

        mettreAJourCompteurPanier();

    }
);