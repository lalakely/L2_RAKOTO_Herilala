document.addEventListener('DOMContentLoaded', function () {
    let livresData = []; // Contiendra tous les livres
    let livresAffiches = []; // Contiendra les livres à afficher après filtrage
    let pageCourante = 1;
    const livresParPage = 4; // Nombre de livres par page

    const fetchLivres = () => {
        fetch('../assets/Json/library.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data fetched:', data); // Debug: vérifier que les données sont bien récupérées
                livresData = data.livres;
                filtrerLivres();
            })
            .catch(error => {
                console.error('Erreur lors du chargement du fichier JSON:', error);
            });
    };

    const afficherLivres = () => {
        const listeLivreContainer = document.querySelector('.liste-livre-dynamic');
        if (!listeLivreContainer) {
            console.error('listeLivreContainer not found'); // Debug: vérifier que l'élément est trouvé
            return;
        }
        listeLivreContainer.innerHTML = ''; // Clear existing content

        const startIndex = (pageCourante - 1) * livresParPage;
        const endIndex = startIndex + livresParPage;
        livresAffiches.slice(startIndex, endIndex).forEach(livre => {
            const livreHTML = `
                <div class="livre">
                    <div class="livre-image" style="
                        background: url('${livre.image}');
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                    ">
                    </div>
                    <div class="livre-titre">
                        ${livre.titre}
                    </div>
                    <div class="livre-auteur">
                        ${livre.auteurs.join(', ')}
                    </div>
                    <div class="livre-boutons">
                        <div class="livre-details">Details</div>
                        <a style="text-decoration:none;color:#fff;padding:10px; font-size:12px;" href="./assets/php/supprimer.php?Titre=${livre.titre}&Auteur= ${livre.auteurs.join(', ')}"> 
                            <div class="livre-supprimer">Supprimer</div>
                        </a>
                    </div>
                </div>
            `;
            listeLivreContainer.innerHTML += livreHTML;
        });

        console.log('Livres affichés:', livresAffiches.slice(startIndex, endIndex)); // Debug: vérifier les livres affichés

        // Ajouter des écouteurs d'événements pour les boutons "Details" après l'affichage des livres
        const detailsButtons = document.querySelectorAll('.livre-details');
        detailsButtons.forEach((button, index) => {
            button.addEventListener('click', function () {
                afficherDetails(index);
            });
        });
    };

    const afficherDetails = (index) => {
        const detailsContainer = document.getElementById("livre-details-container");
        const livre = livresAffiches[index];

        // Mettre à jour le contenu du conteneur de détails avec les détails du livre
        detailsContainer.querySelector('.livre-image-details').style.backgroundImage = `url('${livre.image}')`;
        detailsContainer.querySelector('.livre-titre-details').textContent = `Titre : ${livre.titre}`;
        detailsContainer.querySelector('.livre-auteur-details').textContent = `Auteur : ${livre.auteurs.join(', ')}`;
        detailsContainer.querySelector('.livre-genre-details').textContent = `Genre : ${livre.genre}`;
        detailsContainer.querySelector('.livre-editeur-details').textContent = `Editeur : ${livre.editeur}`;
        detailsContainer.querySelector('.livre-resume-details').textContent = `Résumé : ${livre.resume}`;
        detailsContainer.querySelector('.livre-langue-details').textContent = `Langue : ${livre.langue}`;
        detailsContainer.querySelector('.livre-disponibilite-details').textContent = `Disponibilité : ${livre.disponibilite ? 'Oui' : 'Non'}`;
        detailsContainer.querySelector('.livre-nombre-page-details').textContent = `Pages : ${livre.nombrePages}`;
        detailsContainer.querySelector('.livre-etat-details').textContent = `Etat : ${livre.etat}`;
        detailsContainer.querySelector('.livre-emplacement-details').textContent = `Emplacement : ${livre.emplacement}`;
        detailsContainer.querySelector('.link').href = `./assets/php/supprimer.php?Titre=${livre.titre}&Auteur= ${livre.auteurs.join(', ')}`;
        
        // Afficher les détails en supprimant la classe 'hidden'
        detailsContainer.classList.remove('hidden');
    };

    const filtrerLivres = () => {
        const rechercheInput = document.querySelector('.recherche-livre input');
        const typeRechercheSelect = document.getElementById('type-recherche');
        const typeRecherche = typeRechercheSelect.value.toLowerCase();
        const termeRecherche = rechercheInput.value.toLowerCase();
        const genreActuel = document.querySelector('.genre.active')?.getAttribute('data-genre') || 'Tous';

        console.log('Type de recherche:', typeRecherche); // Debug
        console.log('Terme de recherche:', termeRecherche); // Debug
        console.log('Genre actuel:', genreActuel); // Debug

        livresAffiches = livresData.filter(livre => {
            const matchRecherche = typeRecherche === 'auteur' 
                ? livre.auteurs.join(', ').toLowerCase().includes(termeRecherche) 
                : livre[typeRecherche].toLowerCase().includes(termeRecherche);
            
            const matchGenre = genreActuel === 'Tous' || livre.genre.toLowerCase() === genreActuel.toLowerCase();

            return matchRecherche && matchGenre;
        });

        // Mettre à jour la pagination
        const totalPages = Math.ceil(livresAffiches.length / livresParPage);
        if (pageCourante > totalPages) {
            pageCourante = totalPages;
        }
        afficherLivres();
        afficherPagination(totalPages);
    };

    const afficherPagination = (totalPages) => {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) {
            console.error('paginationContainer not found'); // Debug: vérifier que l'élément est trouvé
            return;
        }
        paginationContainer.innerHTML = ''; // Clear existing content

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', function () {
                pageCourante = i;
                afficherLivres();
            });
            paginationContainer.appendChild(button);
        }

        console.log('Pagination affichée:', totalPages); // Debug: vérifier les pages affichées
    };

    // Gérer le clic sur le bouton de recherche
    const rechercheButton = document.querySelector('.recherche-livre button');
    if (rechercheButton) {
        rechercheButton.addEventListener('click', function () {
            filtrerLivres();
        });
    } else {
        console.error('Recherche button not found'); // Debug: vérifier que le bouton est trouvé
    }

    // Gérer le changement de type de recherche
    const typeRechercheSelect = document.getElementById('type-recherche');
    if (typeRechercheSelect) {
        typeRechercheSelect.addEventListener('change', function () {
            filtrerLivres();
        });
    } else {
        console.error('Type recherche select not found'); // Debug: vérifier que le select est trouvé
    }

    // Gérer le changement de page précédente
    const pagePrecedenteButton = document.getElementById('page-precedente');
    if (pagePrecedenteButton) {
        pagePrecedenteButton.addEventListener('click', function () {
            if (pageCourante > 1) {
                pageCourante--;
                afficherLivres();
            }
        });
    } else {
        console.error('Page precedente button not found'); // Debug: vérifier que le bouton est trouvé
    }

    // Gérer le changement de page suivante
    const pageSuivanteButton = document.getElementById('page-suivante');
    if (pageSuivanteButton) {
        pageSuivanteButton.addEventListener('click', function () {
            const totalPages = Math.ceil(livresAffiches.length / livresParPage);
            if (pageCourante < totalPages) {
                pageCourante++;
                afficherLivres();
            }
        });
    } else {
        console.error('Page suivante button not found'); // Debug: vérifier que le bouton est trouvé
    }

    // Gérer le clic sur les genres pour filtrer les livres
    document.querySelectorAll('.genre').forEach(genreElement => {
        genreElement.addEventListener('click', function () {
            document.querySelectorAll('.genre').forEach(elem => elem.classList.remove('active'));
            this.classList.add('active');
            filtrerLivres();
        });
    });

    // Ajoutez des écouteurs d'événements pour les boutons "Details" après l'affichage des livres
    const detailsButtons = document.querySelectorAll('.livre-details');
    const detailsContainer = document.getElementById("livre-details-container");

    detailsButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            afficherDetails(index);
        });
    });

    // Gérer la fermeture de la fenêtre de détails
    const closeDetailsButton = document.querySelector('.livre-details-fermer');
    if (closeDetailsButton) {
        closeDetailsButton.addEventListener('click', function () {
            detailsContainer.classList.add('hidden');
        });
    } else {
        console.error('Close details button not found'); // Debug: vérifier que le bouton est trouvé
    }
    
    const ajoutLink = document.getElementById("ajout-link");
     const ajoutForm = document.getElementById("ajout-container");
     ajoutLink.addEventListener("click",function (){
         ajoutForm.style.display = "flex";
     });

     const annulerAjout = document.getElementById("annuler-ajout");
     annulerAjout.addEventListener("click",function (){
         ajoutForm.style.display = "none";
     });

    fetchLivres();
});
