<?php
// Chemin du fichier JSON
$json_file = '../Json/library.json';

// Vérifie si les paramètres Titre et Auteur sont présents dans l'URL
if (isset($_GET['Titre']) && isset($_GET['Auteur'])) {
    // Récupère et nettoie les paramètres Titre et Auteur de l'URL
    $titre = trim($_GET['Titre']);
    $auteur = trim($_GET['Auteur']);

    // Lit le contenu du fichier JSON
    $json_data = file_get_contents($json_file);
    $data = json_decode($json_data, true);

    // Recherche le livre correspondant dans le tableau des livres
    foreach ($data['livres'] as $key => $livre) {
        if (trim($livre['titre']) == $titre && trim(implode(', ', $livre['auteurs'])) == $auteur) {
            // Supprime le livre du tableau
            unset($data['livres'][$key]);
            break;
        }
    }

    // Réécrit le fichier JSON avec le livre supprimé
    $json_updated = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($json_file, $json_updated);

    // Redirige vers la page précédente
    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit;
} else {
    // Les paramètres Titre et Auteur ne sont pas présents dans l'URL
    echo 'Paramètres manquants.';
}
?>
