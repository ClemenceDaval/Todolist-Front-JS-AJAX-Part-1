//console.log('task.js chargé');

const task = {

  addAllEventListeners: function(taskElement){

    // ciblage du nom de la tache
    let taskNameElement = taskElement.querySelector('.task__name-display');
    taskNameElement.addEventListener('click', task.handleClickOnTaskName);

    // ciblage du bouton d'édition de la tâche
    let taskEditButtonElement = taskElement.querySelector('.task__button--modify');
    taskEditButtonElement.addEventListener('click', task.handleClickOnEditButton);

    // ciblage de l'input d'édition du nom de la tache
    let taskInputNameElement =  taskElement.querySelector('.task__name-edit');
    taskInputNameElement.addEventListener('blur', task.handleBlurOnTaskInputName);
    //on surveille les frappes de clavier (le moment ou on relache la touche)
    taskInputNameElement.addEventListener('keyup', task.handleKeyUpOnTaskInputName);
    
    //ciblage du bouton pour mettre une tache en status terminé
    let validateButtonElement = taskElement.querySelector('.task__button--validate');
    validateButtonElement.addEventListener('click', task.handleClickOnValidateButtonElement);

    //ciblage du bouton pour mettre une tâche complète en incomplete
    let incompleteButtonElement = taskElement.querySelector('.task__button--incomplete');
    incompleteButtonElement.addEventListener('click', task.handleClickOnIncompleteButton);

    //ciblage du bouton pour archiver une tâche
    let archiveButtonElement = taskElement.querySelector('.task__button--archive');
    archiveButtonElement.addEventListener('click', task.handleClickOnArchiveButton);
    
    //ciblage du bouton pour supprimer une tâche
    let deleteButtonElement = taskElement.querySelector('.task__button--delete');
    deleteButtonElement.addEventListener('click', task.handleClickOnDeleteButton);

    // ciblage du bouton pour désarchiver une tâche archivée
    let desarchiveButtonElement = taskElement.querySelector('.task__button--desarchive');
    desarchiveButtonElement.addEventListener('click', task.handleClickOnDesarchiveButton);

  },

  handleClickOnValidateButtonElement : function(event){
    // récupération du bouton validation (qui a déclenché l'event)
    let validateButtonElement = event.currentTarget;
    let taskElement = validateButtonElement.closest('.task');
    // une fois que l'élement du DOM correspondant a une tache
    // a été récupété, nous lui appliquons les bonnes classes CSS
    taskElement.classList.add('task--complete');
    taskElement.classList.remove('task--todo');
  
    task.setCompletion(taskElement, 100);

    // appel à l'api pour mettre à jour(patcher) le niveau de completion de la tache
    // récupération de l'id de la tâche
    const taskId = taskElement.dataset.taskId;

    // on prépare nos données 
    let data = {
    'completion' : 100, // la tache est terminée
    }

    // on prépare les entêtes HTTP (headers) de la requete
    // afin de spécifier que les données sont en json
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // on consome l'API pour ajouter en BDD
    let fetchOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: JSON.stringify(data) // On ajoute les données, encodée en JSON, dans le corps de la requête
    };

    const url = 'http://localhost:8080/tasks/' + taskId;

    fetch(url, fetchOptions)
    .then(
        function(response){
            if (response.status == 200){
                console.log('La tâche a été marquée comme complétée');
                errors.eraseError();
            } else {
                console.log('La modification de la tâche a échoué');            errors.displayError('L\'ajout de la tâche a échoué');
                errors.displayError('La modification de la tâche a échoué');

            }
        return response.json()
    })
    .then(
        function(data){
        //console.log(data)
    });
  },

  handleClickOnIncompleteButton: function(event){

    // récupération du bouton incomplete (qui a déclenché l'event)
    let incompleteButtonElement = event.currentTarget;
    let taskElement = incompleteButtonElement.closest('.task');
    // une fois que l'élement du DOM correspondant a une tache
    // a été récupété, nous lui appliquons les bonnes classes CSS
    taskElement.classList.remove('task--complete');
    taskElement.classList.add('task--todo');

    task.setCompletion(taskElement, 0);

    // appel à l'api pour mettre à jour(patcher) le niveau de completion de la tache
    // récupération de l'id de la tâche
    const taskId = taskElement.dataset.taskId;

    // on prépare nos données 
    let data = {
    'completion' : 0, // la tache est terminée
    }

    // on prépare les entêtes HTTP (headers) de la requete
    // afin de spécifier que les données sont en json
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // on consome l'API pour ajouter en BDD
    let fetchOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: JSON.stringify(data) // On ajoute les données, encodée en JSON, dans le corps de la requête
    };

    const url = 'http://localhost:8080/tasks/' + taskId;

    fetch(url, fetchOptions)
    .then(
        function(response){
            if (response.status == 200){
                console.log('La tâche a été marquée comme incomplète');
                errors.eraseError();
                return response.json();
            } else {
                console.log('La modification de la tâche a échoué');
                errors.displayError('La modification de la tâche a échoué');

            }
    })
    .then(
        function(data){
        //console.log(data)
    });
  },

  handleClickOnTaskName: function(event){
    // récupération de l'élément ayant déclenché l'event
    let taskNameElement = event.currentTarget;
    //console.log(taskNameElement);

    // récupération de l'élément "ancêtre" le plus proche
    // ayant la classe "task"
    let taskElement = taskNameElement.closest('.task');
    //console.log(taskElement);
    // une fois l'élément tâche récupéré
    // nous lui ajoutons la classe CSS 'task--edit'
    taskElement.classList.add('task--edit');
    // ciblage de l'input d'édition de la tache
    let taskNameInputElement = taskElement.querySelector('.task__name-edit');
    //console.log(taskNameInputElement);
    taskNameInputElement.focus();

    // BONUS placer le cuseur à la fin de l'input
    // récupérer la taille de texte dans l'input
    let length = taskNameInputElement.value.length;
    // on placer le cuseur  la fin de l'input (on débute une
    //selection à la fin de l'input; et on arrete la selection à la fin de l'input ; ça fait une selection vide !!)
    taskNameInputElement.setSelectionRange(length, length);
  },

  handleClickOnEditButton: function(event){
    //alert('clic edit tache');
    task.handleClickOnTaskName(event);
  },

  handleBlurOnTaskInputName: function(event){

    //récupération de la valeur saisie par l'utilisateur
    let taskInputNameElement = event.currentTarget;
    let taskNewName = taskInputNameElement.value;
    // récupération de l'élément "ancêtre" le plus proche
    // ayant la classe "task"
    let taskElement = taskInputNameElement.closest('.task');
    //console.log(taskElement);

    //ciblage de l'élément affichant le nom de la tâche (le p)
    let taskNameElement = taskElement.querySelector('.task__name-display');
    
    // appel à l'api pour mettre à jour(patcher) le niveau de completion de la tache
    // récupération de l'id de la tâche
    const taskId = taskElement.dataset.taskId;

    // on prépare nos données 
    let data = {
    'title' : taskNewName, // on met à jour la BDD avec le nouveau nom de la tâche
    }

    // on prépare les entêtes HTTP (headers) de la requete
    // afin de spécifier que les données sont en json
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // on consome l'API pour ajouter en BDD

    let fetchOptions = {
    method: 'PATCH', // on modifie une seule valeur => PATCH
    headers: myHeaders,
    body: JSON.stringify(data) // On ajoute les données, encodée en JSON, dans le corps de la requête
    };

    const url = 'http://localhost:8080/tasks/' + taskId;

    fetch(url, fetchOptions)
    .then(
        function(response){
            if (response.status == 200){
                console.log('La tâche a été modifiée');
                errors.eraseError();
                // mise à jour du contenu texte de l'élement affichant le nom de la tache
                taskNameElement.textContent = taskNewName;
                // on retire la classe CSS task--edit de l'élement task
                taskElement.classList.remove('task--edit');
                return response.json()
            } else {
                console.log('La modification de la tâche a échoué');
                errors.displayError('La modification de la tâche a échoué');

            }
    })
    .then(
        function(data){
        //console.log(data)
    });
    
  },

  handleKeyUpOnTaskInputName: function(event){
    // event.key nous permet de récupérér le nom de la touche qui a été pressé
    //console.log(event.key);
    if(event.key === 'Enter'){
      // on appelle le meme callback quie lorsuq'il y a un event blur sur l'input
      task.handleBlurOnTaskInputName(event);
    }
    
  },

  createDOMElement : function(taskName, taskCategoryName){
    //ciblage du template HTML correspondant à une tache
    let template = document.getElementById('task-template');

    // création d'une copie du template pour pouvoir travailler dessus
    // et renseigner les infos de la nouvelle tache.
    let templateForNewTask = template.content.cloneNode(true);

    // remplacer les valeurs dans la copie du template
    // ci dessous cf data-category dans les task
    templateForNewTask.querySelector('.task').dataset.category = taskCategoryName;
    templateForNewTask.querySelector('.task__category p').textContent = taskCategoryName;

    // remplacement du nom de la tâche dans la copie du template
    templateForNewTask.querySelector('.task__name-display').textContent = taskName;

    // input ...
    templateForNewTask.querySelector('.task__name-edit').setAttribute('value', taskName);
    //templateForNewTask.querySelector('.task__name-edit').value = taskName;

    // on enrgistre tous les events sur l'élement du DOM que nous venons de créer
    task.addAllEventListeners(templateForNewTask);

    return templateForNewTask;

  },

  setStatus: function(taskElement, status){
    //! MERCI LAURENT !
    taskElement.querySelector('.task').classList.replace('task--todo', 'task--' + status);
    //return taskElement;
  },

  setCompletion: function(taskElement, completion){
    let progressBar = taskElement.querySelector('.progress-bar__level');
    progressBar.style.width = completion + '%';
    return taskElement;
  },

  setId: function(taskElement, id){
    taskElement.querySelector('.task').dataset.taskId = id;
    //return taskElement;
  },

  getId: function(taskElement){
    return taskElement.dataset.taskId ;
  },

  setDisplay: function(taskElement, value){
    taskElement.querySelector('.task').style.display = value ;
  },

  handleClickOnArchiveButton: function(event){

    // récupération du bouton archive (qui a déclenché l'event)
    let archiveButtonElement = event.currentTarget;
    let taskElement = archiveButtonElement.closest('.task');
    // une fois que l'élement du DOM correspondant a une tache
    // a été récupété, nous lui appliquons les bonnes classes CSS

    // appel à l'api pour mettre à jour(patcher) la tâche
    // récupération de l'id de la tâche
    const taskId = taskElement.dataset.taskId;

    // on prépare nos données 
    let data = {
      'status' : 2 // le status de la tâche est 2 = tâche archivée
    }

    // on prépare les entêtes HTTP (headers) de la requete
    // afin de spécifier que les données sont en json
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // on consome l'API pour ajouter en BDD

    let fetchOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: JSON.stringify(data) // On ajoute les données, encodée en JSON, dans le corps de la requête
    };

    const url = 'http://localhost:8080/tasks/' + taskId;
    
    fetch(url, fetchOptions)
    .then(
        function(response){
            if (response.status == 200){
                taskElement.classList.remove('task--complete');
                taskElement.classList.add('task--archive');
                taskElement.style.display = 'none';
                errors.eraseError();
            } else {
              errors.displayError('La modification de la tâche a échoué');
              errors.displayError('La modification de la tâche a échoué');

            }
        return response.json()
    })
    .then(
        function(data){
        //console.log(data)
    });


  },

  handleClickOnDesarchiveButton: function(event){

    // récupération du bouton archive (qui a déclenché l'event)
    let desarchiveButtonElement = event.currentTarget;
    let taskElement = desarchiveButtonElement.closest('.task');
    // une fois que l'élement du DOM correspondant a une tache
    // a été récupété, nous lui appliquons les bonnes classes CSS

    // appel à l'api pour mettre à jour(patcher) la tâche
    // récupération de l'id de la tâche
    const taskId = taskElement.dataset.taskId;

    // on prépare nos données 
    let data = {
      'status' : 1 // le status de la tâche est 1 = tâche activée
    }

    // on prépare les entêtes HTTP (headers) de la requete
    // afin de spécifier que les données sont en json
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // on consome l'API pour ajouter en BDD

    let fetchOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: JSON.stringify(data) // On ajoute les données, encodée en JSON, dans le corps de la requête
    };

    const url = 'http://localhost:8080/tasks/' + taskId;
    
    fetch(url, fetchOptions)
    .then(
        function(response){
            if (response.status == 200){
                taskElement.classList.add('task--complete');
                taskElement.classList.remove('task--archive');
                taskElement.style.display = 'none';
                console.log('La tâche a été desarchivée');
                errors.eraseError();
            } else {
                console.log('La modification de la tâche a échoué');
                errors.displayError('La modification de la tâche a échoué');

            }
        return response.json()
    })
    .then(
        function(data){
        //console.log(data)
    });


  },

  handleClickOnDeleteButton: function(event){
    // récupération du bouton delete (qui a déclenché l'event)
    let deleteButtonElement = event.currentTarget;
    let taskElement = deleteButtonElement.closest('.task');

    // appel à l'api pour mettre à jour(patcher) la tâche
    // récupération de l'id de la tâche
    const taskId = taskElement.dataset.taskId;

    // on prépare nos données 
    let data = {}

    // on prépare les entêtes HTTP (headers) de la requete
    // afin de spécifier que les données sont en json
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // on consome l'API pour ajouter en BDD

    let fetchOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: JSON.stringify(data) // On ajoute les données, encodée en JSON, dans le corps de la requête
    };

    const url = 'http://localhost:8080/tasks/' + taskId;

    fetch(url, fetchOptions)
    .then(
        function(response){
            if (response.status == 200){
              console.log('La tâche a été supprimée');
              //console.log(taskElement);
              taskElement.style.display = 'none' ;
              errors.eraseError();

            } else {
              console.log('La suppression de la tâche a échoué');                  errors.displayError('La modification de la tâche a échoué');
              errors.displayError('La suppression de la tâche a échoué');

            }
    })
   

  }

}



