//console.log('%c' + 'tasksList.js chargé', 'color: #f0f; font-size: 1rem; background-color:#fff');


const tasksList = {
  // initialisation de toutes les tâches présentent dans la page
  initializeTasksFromDom: function (){
    //console.log('%c' + 'Methode initializeTasksFromDom executée depuis module tasksList', 'color: #f0f; font-size: 1rem; background-color:#fff');
 
    // dans une variable on va récupérerer TOUTES LES TACHES
    
    let taskElementsList = document.querySelectorAll('.tasks .task');
    //console.log(taskElementsList);
    //console.log(taskElementsList);
    // pour chacune des taches récupérées, nous allons 
    // enregistrer les event listeners qui nous interessent

    for(let taskElement of taskElementsList){
      // pour chaque TaskElement, nous utiliserons le module
      // task.js pour initialiser l'enregistrement des events
      //console.log(taskElement);
      task.addAllEventListeners(taskElement)
    }
  },

  addTaskInDOM : function(taskElement){
    // ajout du taskElement au début de la liste
    let taskListElement = document.querySelector('.tasks');
    // nous souhaitons que la tache s'affiche au DEBUT de la liste
    taskListElement.prepend(taskElement);

  },

  loadTasksFromAPI: function(taskStatus){
    const url = 'http://localhost:8080/tasks';

    //envoyer la requete
    fetch(url)
      .then(tasksList.convertFromJson) // nous convertissons la réponse json en objet
      .then(tasksList.displayTasks); // on affiche les taches
  },
  

  convertFromJson(response){
    return response.json();
  },

  displayTasks: function(tasksListing){
    // une fois les taches récupérées, nous devons les ajouter au DOM

    for(let taskData of tasksListing){
      //console.log(taskData);
      // récupération des infos dont nous allons avoir besoin
      let taskName = taskData.title;
      let categoryName = taskData.category.name;

      // nous appelons le composant task pour lui demande de nous retrouner un element HTML "préfabriqué" et mis a jour 
      let taskElement = task.createDOMElement(taskName, categoryName);
      //console.log(taskData.id);
      // modification de l'élément en fonction du status de chaque  tache
      //console.log(taskElement);

      if(taskData.status == 2){
        // si le status de la tache vaut 2, il faut mettre a jour l'élement
        // et lui appliquer le status "archive"
        // et un displya none
        task.setStatus(taskElement, 'archive');
        task.setDisplay(taskElement, 'none');

        //console.log(taskElement);
        
      } else if(taskData.status == 1 && taskData.completion == 100){
        task.setStatus(taskElement, 'complete');
      }    
         
      // gestion progress bar
      task.setCompletion(taskElement, taskData.completion);
      //mise a jour de l'id (dans le DOM) de la tache
      task.setId(taskElement, taskData.id);

      tasksList.addTaskInDOM(taskElement);

    }
  },
  
}