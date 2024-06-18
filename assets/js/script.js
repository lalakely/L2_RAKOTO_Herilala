document.getElementById('ajouter').addEventListener('click', function(event) {
    const titre = document.getElementById('Titre').value;
    const auteur = document.getElementById('Auteur').value;
    const isbn = document.getElementById('Isbn').value;
    const genre = document.getElementById('Genre').value;
    const langue = document.getElementById('Langue').value;
    const nbrpg = document.getElementById('Nbrpg').value;
    const resume = document.getElementById('resume').value;
    const dispo = document.getElementById('dispo').value;
    const etat = document.getElementById('etat').value;
    const emplacement = document.getElementById('emplacement').value;
    const editeur = document.getElementById('Editeur').value;
    

    // Récupérer le fichier sélectionné
    const imgInput = document.getElementById('Img');
    const imgFile = imgInput.files[0];

    // Créer un objet FormData
    const formData = new FormData();
    formData.append('Titre', titre);
    formData.append('Editeur',editeur);
    formData.append('Auteur', auteur);
    formData.append('Isbn', isbn);
    formData.append('Genre', genre);
    formData.append('Langue', langue);
    formData.append('Nbrpg', nbrpg);
    formData.append('resume', resume);
    formData.append('dispo', dispo);
    formData.append('etat', etat);
    formData.append('emplacement', emplacement);
    formData.append('Img', imgFile);

    // Envoyer les données à un script PHP côté serveur
    fetch('./assets/php/index.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        // Actualiser la page après l'envoi des données
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Empêcher le formulaire de se soumettre normalement
    event.preventDefault();
});
