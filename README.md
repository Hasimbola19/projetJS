# projetJS
Projet web Aquilina


Mode de travail, utilisation de GitHub, lien vers le projet : https://github.com/Hasimbola19/projetJS
Distribution de tache, Sophie partie panier, Hasimbola partie Boutique et sauvegarde du panier dans le localStorage, Bader partie catalog
Chacun à fait sa partie et à envoyer son code
1 - Les images sont affichées de manière dynamique, en créant de block createProduct que l'on boucle lors de la création de la boutique à l'initialisation de la page
2 - Panier fonctionnel, id de type i-text, on a créer un autre block pour contenir l'image, le control pour modifier la quantité, le prix et le control pour supprimer, le problème étant que le montant ne se modifiait pas lorsque l'on ajoutait un element ou lorsqu'on modifiait les elements dans le panier, la solution était de créer une fonction updatePanier que l'on a appeler a la fin de chaque modification dans le panier
3 - Createfigureblock terminé, on a créer un block pour créer une balise de type figure
4 - Évènement keyup est affiché dans la console du navigateur lorsque l'on texte quelque chose dans l'element filter, le filtre fonctionne mais avec quelques restrictions, si le nom du produit est trop long, on n'a pas de retour, par exemple pour "un joli nounours marron avec un foulard", si l'on tape un, nounours, marron le filtre fonctionne mais si l'on tape les autres mots on n' pas de retour
5 - createOrderBlock fonctionne, pour afficher les commandes en mode dynamique du cote du panier, le bouton dans la partie boutique change d'opacité si la quantité est à 0 et augment si la quantité est > 0  
6 - Mise en panier fonctionnel, montant se met à jour, les elements deja presents ne sont plus rajouter mais la quantité augmente, on peut ajouter différents produits de différents catalogues, on peut modifier la quantité, supprimer des produits
7 - Suppression des elements du panier fonctionnel, on a créer un block pour le control de la suppression du panier
8 - Modification de la quantité d'un article dans le panier fonctionnel, on a créer un block control pour la modification de la quantité du panier
9 - Sauvegarde de l'état du panier dans localStorage fonctionnel, pour cette partie, on a juste pris le panier en json et on a sauvegarder directement dans localStorage, lors de l'initialisation de la page, on appelle la fonction qui va checker si le localStorage est vide ou pas, si c'est vide, le panier est vide, sinon, les elements sont disposées avec la fonction loadPanierFromLocalStorage
10 - Supprimer tout les elements dans le localStorage
