<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $titre = $_POST['Titre'];
    $editeur = $_POST['Editeur'];
    $auteur = $_POST['Auteur'];
    $isbn = $_POST['Isbn'];
    $genre = $_POST['Genre'];
    $langue = $_POST['Langue'];
    $nbrpg = $_POST['Nbrpg'];
    $resume = $_POST['resume'];
    $dispo = $_POST['dispo'];
    $etat = $_POST['etat'];
    $emplacement = $_POST['emplacement'];
    $img = $_FILES['Img']['name'];

    // Chemin du fichier JSON
    $filePath = "../Json/library.json";

    // Lire le contenu actuel du fichier JSON
    $jsonContent = file_get_contents($filePath);

    // Convertir le contenu en tableau associatif
    $data = json_decode($jsonContent, true);

    // Ajouter les nouvelles données à la fin du tableau 'livres'
    $newData = array(
        "titre" => $titre,
        "auteurs" => array($auteur),
        "isbn" => $isbn,
        "image" => $img,
        "editeur" => $editeur,
        "datePublication" => "1949",
        "genre" => $genre,
        "resume" => $resume,
        "langue" => $langue,
        "nombrePages" => $nbrpg,
        "disponibilite" => $dispo,
        "etat" => $etat,
        "emplacement" => $emplacement
    );

    $data['livres'][] = $newData;

    // Convertir le tableau en JSON
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);

    // Écrire les données dans le fichier
    file_put_contents($filePath, $jsonData);

    // Déplacer le fichier uploadé vers un dossier de destination
    $targetDir = "uploads/";
    $targetFile = $targetDir . basename($_FILES["Img"]["name"]);
    move_uploaded_file($_FILES["Img"]["tmp_name"], $targetFile);

    // Confirmer que les données ont été écrites
    echo "Données écrites dans le fichier JSON.";
} else {
    // Le formulaire n'a pas été soumis
    echo "Le formulaire n'a pas été soumis.";
}
?>
