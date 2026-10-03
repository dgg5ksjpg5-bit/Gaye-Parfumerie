/* =========================================================
   GAYE PARFUMERIE
   PAGE DE CONFIRMATION + WHATSAPP
========================================================= */


/* =========================================================
   ELEMENT DE LA PAGE
========================================================= */

const confirmationContent =
    document.getElementById("confirmation-content");


/* =========================================================
   RECUPERER LA DERNIERE COMMANDE
========================================================= */

function recupererDerniereCommande() {

    const commandes =
        JSON.parse(
            localStorage.getItem("gayeCommandes")
        ) || [];


    if (commandes.length === 0) {
        return null;
    }


    return commandes[commandes.length - 1];

}


/* =========================================================
   AFFICHER LE MODE DE PAIEMENT
========================================================= */

function afficherModePaiement(mode) {

    if (mode === "wave") {
        return "Wave";
    }

    if (mode === "orange-money") {
        return "Orange Money";
    }

    if (mode === "livraison") {
        return "Paiement à la livraison";
    }

    return mode;

}


/* =========================================================
   PREPARER LE MESSAGE WHATSAPP
========================================================= */

function envoyerCommandeWhatsApp(commande) {

    let message =
        "Bonjour Gaye Parfumerie !\n\n" +

        "🧾 NOUVELLE COMMANDE\n\n" +

        "Numéro : " +
        commande.numero +
        "\n\n" +

        "👤 CLIENT\n" +

        "Nom : " +
        commande.client.nom +
        "\n" +

        "Téléphone : " +
        commande.client.telephone +
        "\n" +

        "Ville : " +
        commande.client.ville +
        "\n" +

        "Adresse : " +
        commande.client.adresse +
        "\n\n" +

        "🛍️ PRODUITS\n";


    commande.produits.forEach(function (produit) {

        const sousTotal =
            produit.prix * produit.quantite;


        message +=
            "- " +
            produit.nom +
            " x" +
            produit.quantite +
            " : " +
            sousTotal.toLocaleString("fr-FR") +
            " FCFA\n";

    });


    message +=
        "\n💰 TOTAL : " +
        commande.total.toLocaleString("fr-FR") +
        " FCFA\n\n" +

        "💳 Paiement : " +
        afficherModePaiement(
            commande.client.paiement
        ) +
        "\n\n" +

        "Merci. Je souhaite confirmer cette commande.";


    const numeroWhatsApp =
        "221774875357";


    const url =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   AFFICHER LA CONFIRMATION
========================================================= */

function afficherConfirmation() {

    if (!confirmationContent) {
        return;
    }


    const commande =
        recupererDerniereCommande();


    /* =========================
       AUCUNE COMMANDE
    ========================= */

    if (!commande) {

        confirmationContent.innerHTML = `

            <div class="confirmation-icon">
                !
            </div>

            <h1>
                Aucune commande trouvée
            </h1>

            <p class="confirmation-text">
                Nous n'avons trouvé aucune commande récente.
            </p>

            <div class="confirmation-actions">

                <a
                    href="boutique.html"
                    class="btn btn-primary"
                >
                    Retour à la boutique
                </a>

            </div>

        `;

        return;
    }


    /* =========================
       PRODUITS
    ========================= */

    let produitsHTML = "";


    commande.produits.forEach(function (produit) {

        const totalProduit =
            produit.prix * produit.quantite;


        produitsHTML += `

            <div class="confirmation-product">

                <div>

                    <strong>
                        ${produit.nom}
                    </strong>

                    <span>
                        Quantité : ${produit.quantite}
                    </span>

                </div>

                <strong>
                    ${totalProduit.toLocaleString("fr-FR")}
                    FCFA
                </strong>

            </div>

        `;

    });


    /* =========================
       AFFICHER LA PAGE
    ========================= */

    confirmationContent.innerHTML = `

        <div class="confirmation-icon">
            ✓
        </div>


        <div class="confirmation-brand">
            GAYE PARFUMERIE
        </div>


        <h1>
            Merci pour votre commande !
        </h1>


        <p class="confirmation-text">
            Votre commande a bien été enregistrée.
            Nous vous contacterons prochainement.
        </p>


        <div class="order-number">

            <span>
                Numéro de commande
            </span>

            <strong>
                ${commande.numero}
            </strong>

        </div>


        <div class="customer-info">

            <h2>
                Informations client
            </h2>


            <div class="info-row">

                <span>
                    Nom
                </span>

                <strong>
                    ${commande.client.nom}
                </strong>

            </div>


            <div class="info-row">

                <span>
                    Téléphone
                </span>

                <strong>
                    ${commande.client.telephone}
                </strong>

            </div>


            <div class="info-row">

                <span>
                    Ville
                </span>

                <strong>
                    ${commande.client.ville}
                </strong>

            </div>


            <div class="info-row">

                <span>
                    Adresse
                </span>

                <strong>
                    ${commande.client.adresse}
                </strong>

            </div>


            <div class="info-row">

                <span>
                    Paiement
                </span>

                <strong>
                    ${afficherModePaiement(
                        commande.client.paiement
                    )}
                </strong>

            </div>

        </div>


        <div class="confirmation-products">

            <h2>
                Votre commande
            </h2>

            ${produitsHTML}

        </div>


        <div class="confirmation-total">

            <span>
                TOTAL
            </span>

            <strong>
                ${commande.total.toLocaleString("fr-FR")}
                FCFA
            </strong>

        </div>


        <div class="confirmation-actions">


            <button
                type="button"
                class="btn btn-primary"
                id="whatsapp-order"
            >
                💬 Envoyer sur WhatsApp
            </button>


            <a
                href="index.html"
                class="btn btn-outline"
            >
                Retour à l'accueil
            </a>


            <a
                href="boutique.html"
                class="btn btn-outline"
            >
                Continuer mes achats
            </a>


        </div>

    `;


    /* =====================================================
       BOUTON WHATSAPP
    ===================================================== */

    const boutonWhatsApp =
        document.getElementById(
            "whatsapp-order"
        );


    if (boutonWhatsApp) {

        boutonWhatsApp.addEventListener(
            "click",
            function () {

                envoyerCommandeWhatsApp(
                    commande
                );

            }
        );

    }

}


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        afficherConfirmation();


        if (
            typeof mettreAJourCompteurPanier ===
            "function"
        ) {

            mettreAJourCompteurPanier();

        }

    }
);