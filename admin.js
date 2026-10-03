function recupererCommandesAdmin() {

    const commandes =
        JSON.parse(
            localStorage.getItem("gayeCommandes")
        ) || [];

    return commandes;
}


function formaterPrixAdmin(prix) {

    return Number(prix).toLocaleString("fr-FR") + " FCFA";

}


function calculerStatistiques() {

    const commandes =
        recupererCommandesAdmin();


    let chiffreAffaires = 0;

    let produitsVendus = 0;

    const clients = new Set();


    commandes.forEach(function (commande) {

        chiffreAffaires += Number(
            commande.total || 0
        );


        if (commande.telephone) {

            clients.add(
                commande.telephone
            );

        }


        if (commande.produits) {

            commande.produits.forEach(
                function (produit) {

                    produitsVendus +=
                        Number(
                            produit.quantite || 0
                        );

                }
            );

        }

    });


    return {

        chiffreAffaires:
            chiffreAffaires,

        commandes:
            commandes.length,

        clients:
            clients.size,

        produitsVendus:
            produitsVendus

    };

}


function afficherStatistiques() {

    const stats =
        calculerStatistiques();


    const chiffre =
        document.getElementById(
            "admin-chiffre-affaires"
        );

    const commandes =
        document.getElementById(
            "admin-commandes"
        );

    const clients =
        document.getElementById(
            "admin-clients"
        );

    const produits =
        document.getElementById(
            "admin-produits-vendus"
        );


    if (chiffre) {

        chiffre.textContent =
            formaterPrixAdmin(
                stats.chiffreAffaires
            );

    }


    if (commandes) {

        commandes.textContent =
            stats.commandes;

    }


    if (clients) {

        clients.textContent =
            stats.clients;

    }


    if (produits) {

        produits.textContent =
            stats.produitsVendus;

    }

}


function afficherCommandesAdmin(
    listeCommandes = null
) {

    const zone =
        document.getElementById(
            "admin-commandes-list"
        );


    if (!zone) {
        return;
    }


    const commandes =
        listeCommandes ||
        recupererCommandesAdmin();


    if (commandes.length === 0) {

        zone.innerHTML = `
            <div class="empty-orders">
                Aucune commande enregistrée pour le moment.
            </div>
        `;

        return;

    }


    zone.innerHTML = "";


    const commandesInversees =
        [...commandes].reverse();


    commandesInversees.forEach(
        function (commande) {

            const produits =
                commande.produits || [];


            let listeProduits = "";


            produits.forEach(
                function (produit) {

                    listeProduits += `
                        ${produit.nom}
                        × ${produit.quantite}<br>
                    `;

                }
            );


            const date =
                commande.date
                ? new Date(
                    commande.date
                  ).toLocaleString("fr-FR")
                : "";


            const carte =
                document.createElement("div");


            carte.className =
                "order-card";


            carte.innerHTML = `

                <div class="order-top">

                    <div class="order-number">

                        ${commande.numero || "Commande"}

                    </div>

                    <div class="order-date">

                        ${date}

                    </div>

                </div>


                <div class="order-client">

                    👤
                    ${commande.nom || ""}

                </div>


                <div class="order-info">

                    📞
                    ${commande.telephone || ""}

                </div>


                <div class="order-info">

                    📍
                    ${commande.ville || ""}

                    ${commande.adresse || ""}

                </div>


                <div class="order-info">

                    🛍️

                    ${listeProduits}

                </div>


                <div class="order-info">

                    💳
                    ${commande.paiement || ""}

                </div>


                <div class="order-total">

                    ${formaterPrixAdmin(
                        commande.total || 0
                    )}

                </div>

            `;


            zone.appendChild(carte);

        }
    );

}


function rechercherCommandes() {

    const input =
        document.getElementById(
            "admin-search"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            const recherche =
                input.value
                    .toLowerCase()
                    .trim();


            const commandes =
                recupererCommandesAdmin();


            if (!recherche) {

                afficherCommandesAdmin(
                    commandes
                );

                return;

            }


            const resultats =
                commandes.filter(
                    function (commande) {

                        const numero =
                            String(
                                commande.numero || ""
                            ).toLowerCase();


                        const nom =
                            String(
                                commande.nom || ""
                            ).toLowerCase();


                        const telephone =
                            String(
                                commande.telephone || ""
                            ).toLowerCase();


                        return (

                            numero.includes(
                                recherche
                            )

                            ||

                            nom.includes(
                                recherche
                            )

                            ||

                            telephone.includes(
                                recherche
                            )

                        );

                    }
                );


            afficherCommandesAdmin(
                resultats
            );

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        afficherStatistiques();

        afficherCommandesAdmin();

        rechercherCommandes();

    }
);