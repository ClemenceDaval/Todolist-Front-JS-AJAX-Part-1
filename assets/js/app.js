// module principal

const app = {


  displayArchives : false,


  init: function() {
  console.log('%c' + 'Methode init executée', 'color: #f0f; font-size: 1rem; background-color:#fff');
  // initialisation de la liste des taches
  //tasksList.initializeTasksFromDom();
  tasksList.loadTasksFromAPI();

  //initialisation du formulaire d'ajout de tache
  taskForm.addAllEventListeners();

  //chargement des categories depuis l'api
  categoriesList.loadCategoriesFromAPI();

  nav.addAllEventListeners();

      
    }

  
  };
  
  document.addEventListener('DOMContentLoaded', app.init);
  
  console.log('%c' + 'Scrip.js chargé', 'color: #f0f; font-size: 1rem; background-color:#fff');