# TakeAByte

---

## Installation

Pour configurer le projet, suivez ces étapes :

1. **Préparation du Chemin `SQL/BIN`:** Assurez-vous d'avoir le chemin complet vers le répertoire `SQL/bin`. Ce répertoire contient des fichiers SQL essentiels pour initialiser la base de données et gérer les journaux. Le chemin doit ressembler à `C://wamp/bin/sql/mysql+version/bin` si vous utilisez Wamp, sinon `C://mysql+version/bin`. !! PAS DE SLASH A LA FIN !!


2. **Préparation du Chemin du Document TakeaByte:** Obtenez le chemin complet vers le document TakeaByte. Le chemin devrait ressembler à `C:///chemin/vers/TakeAByte`. !! PAS DE SLASH A LA FIN !!


3. **Fichier SQL d'Initialisation:** Le fichier SQL d'initialisation (`init.sql`) est crucial pour configurer le schéma de base de données initial et les configurations. Assurez-vous d'avoir le fichier dans le document "INSTALL".


4. **Fichier SQL du Journal Principal:** Le fichier SQL du journal principal (`master_log.sql`) est utilisé pour suivre les changements et les mises à jour de la base de données. Assurez-vous d'avoir le fichier dans le document "INSTALL".


5. **Fichier Web Market:** Le fichier Web Market est le fichier `sql` dans lequel se trouve le script de création de la base de données. OAssurez-vous d'avoir le fichier dans le document "INSTALL".


6. **Cookies:** Assurez-vous que les cookies pour `localhost:4000` soient effacés à des fins de test, car cette fonctionnalité n'est pas encore implémentée dans le script.


7. **Nom de la base de données:** Faites attention au nom que vous donnez à votre base de données qu'il ne soit pas déja existant.

8. **SQL ON:** N'oubliez pas de lancer votre system SQL, WampServer ou autre.

9. **Prêt ?:** Si tout est correct, lancez le `setup_databse.bat` pour les systèmes WINDOWS ou exécutez les commandes suivantes dans le dossier `INSTALL` et suivez les instructions :
    ```bash
   chmod +x setup_database_Linux.sh
   bash ./setup_database_Linux.sh
    ```
---

## Utilisation

!! Tous les mots de pass demandés sont celui du premier compte demandé, sauf pour le nouvel utilisateur !!

!! Le nouvel utilisateur n'a accès qu'a la basse nouvellement créée !!

---

## Support

Si vous rencontrez des problèmes ou avez besoin d'une assistance supplémentaire, n'hésitez pas à contacter notre équipe de support à [mail@adebarbarin.com].