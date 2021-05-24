
    let dinosObject = [];
    fetch("./dino.json")
        .then(response => {
        return response.json();
        })
        .then((data) => data.Dinos.map(dt => {
            dinosObject.push(dt);
        }));

    // Create Dino Constructor
    function DinoConstructor(dino) {
        this.where = dino.where;
        this.when = dino.when;
        this.fact = dino.fact;
        this.species = dino.species;
        this.diet = dino.diet;
        this.weight = dino.weight;
        this.height = dino.height;

        this.image = `images/${dino.species.toLowerCase()}.png`;
    }

    const dinoPrototypes = {
         // Create Dino Compare Method 1
        // NOTE: Weight in JSON file is in lbs, height in inches. 
        compareHeight: function (human_height) {

            const heightRatio = (this.height / human_height).toFixed(1);
                // Check if human less than, greater than, or same height as dino
            if (heightRatio > 1) {
                return `${this.species} was ${heightRatio} times taller than you!`;
            }
            if (heightRatio < 1) {
                return `You are ${(human_height / this.height).toFixed(1)} times taller than ${this.species}!`;
            }
            return `You are of the same height as ${this.species}!`;
        },
         
        // Create Dino Compare Method 2
        // NOTE: Weight in JSON file is in lbs, height in inches.
        compareWeight: function (human_weight) {
            const weightRatio = (this.weight / human_weight).toFixed(1);
            // Check if human less than, greater than, or same weight as dino
            if (weightRatio > 1) {
                return `${this.species} weighed ${weightRatio} times more than you!`;
            }
            if (weightRatio < 1) {
                return `You weighed ${(human_weight / this.weight).toFixed(1)} times more than ${this.species}!`;
            }
            return `You are of the same weight as ${this.species}!`;
    
        },
         // Create Dino Compare Method 3
        // NOTE: Weight in JSON file is in lbs, height in inches.        
        compareDiet: function (human_diet) {
            //'An' omnivore or 'a' herbivore/carnivore
            const article = ((human_diet === 'omnivore' ) ? ('an') : ('a'));
    
            if (human_diet === this.diet) {
                return `You are ${article} ${human_diet} same as ${this.species}!`;
            } else {
                return `You are ${article} ${human_diet}, while ${this.species} was a ${this.diet}.`;
            }
        }
    };
    
    
    // assign prototype to dino c
    DinoConstructor.prototype = dinoPrototypes;


    // Create Dino Objects
    function createDinos() {

        let dino_arr = [];
    
        dinosObject.forEach( (this_dino) =>{
            dino_arr.push(new DinoConstructor(this_dino));
        });
    
        // Insert the human placeholder here so that iteration works properly
        // in the grid element construction.  Human should be in the centre square.
        dino_arr.splice(4, 0, 'human placeholder');
    
        return dino_arr;
    }
     //get inputs fields
     const getValue = element_id => document.querySelector(`#${element_id}`);

    // Create Human Object
   
    // Use IIFE to get human data from form
      function getHumanData() {
        let heightfeet, heightinches, weight, name, diet;

        heightfeet = parseFloat(getValue('feet').value);
        heightinches = parseFloat(getValue('inches').value);
        name = getValue('name').value;
        weight = parseFloat(getValue('weight').value);
        diet = getValue('diet').value;
        return (function getdata(){
            return {

                name : name,
                height : (heightfeet * 12) + heightinches,
                weight : weight,
                diet : diet
                                    
            }
        })();
            
    };

         
    // Generate Tiles for each Dino in Array
    function updateView(dinoArray, humanData) {
        // Remove form from screen
        getValue('dino-compare').style.display = 'none';
    
        // Create fragment to attach div elements to
        const fragment = document.createDocumentFragment();

         // generate random number and use it to re-order array
         let randindex = Math.round(Math.random() * 20);
         (randindex % 2 === 0) ? dinoArray.reverse() : "";
       
        // Call to create the dino and human div elements
        for (let i = 0; i < 9; i++) {           
            // Center space (5th element, index 4) is always the human
            let gridSquare = (i === 4) ? generateHumanElement(humanData) : generateDinoElement(humanData, dinoArray[i]);
    
            fragment.appendChild(gridSquare);
        }
        // Attach fragment with grid elements to the DOM
        getValue('grid').appendChild(fragment);
        // Show the 'Go Again' button
        getValue('retry-btn').style.display = 'block';
    }

    function generateDinoElement(human_data, dino_data) {
        let fact;
        // Project requirement is that pigeon should always return the same fact,
        // so we rig the random number for pigeon
        // Dinosaurs each return one of 6 facts randomly chosen here
        const random_num = (dino_data.species === 'Pigeon') ? 2 : (Math.floor(Math.random() * 5));
    
        switch (random_num) {
            case 0:
                fact = `The ${dino_data.species} lived in the ${dino_data.when} period.`;
                break;               
            case 1:
                fact = `The ${dino_data.species} stay in ${dino_data.where}.`;
                break;
            case 2:
                fact = dino_data.fact;
                break;
            case 3:
                fact = dino_data.compareWeight(human_data.weight);
                break;
            case 4:
                fact = dino_data.compareHeight(human_data.height);
                break;
            case 5:
                fact = dino_data.compareDiet(human_data.diet);
                break;
            default:
                fact = 'Dinosaurs are cool!';
        }
    

        // Add tiles to DOM
        const newDiv = document.createElement('div');
        newDiv.classList.add('grid-item');
        newDiv.innerHTML = `<h3>${dino_data.species}</h3><img src="images/${dino_data.species.toLowerCase()}.png" alt="image of ${dino_data.species}"><p>${fact}</p>`;

        return newDiv;
    }

    function generateHumanElement(human_data) {
        // Create the human element for the grid, with user's name and an image
        const newDiv = document.createElement('div');
        newDiv.classList.add('grid-item');
        newDiv.innerHTML = `<h3>${human_data.name}</h3><img src="images/human.png" alt="image of human">`;
    
        return newDiv;
    }
    //CALLBACK FUNCTIONS
    function retry() {
        getValue('error').innerHTML = '';
        getValue('grid').innerHTML = '';
        getValue('retry-btn').style.display = 'none';
        getValue('dino-compare').style.display = 'block';
    }

    function clicked(e) {
        // Prevent default form re-submit on page reload
        e.preventDefault();
       
        const humanData = getHumanData();

        const errorMessage = getValue('error');
        if (humanData.name === "") {
            errorMessage.innerHTML = '<p>Please enter a name</p>';
            return;
        } else if (humanData.height < 1 || isNaN(humanData.height)) {
            errorMessage.innerHTML = '<p>Please enter a height more than 0</p>';
            return;
        } else if (humanData.weight < 1 || isNaN(humanData.weight)) {
            errorMessage.innerHTML = '<p>Please enter a weight more than 0</p>';
            return;
        }
    
        const dinoArray = createDinos();
        updateView(dinoArray, humanData);
    }

   
    // On button click, prepare and display infographic
    (function () {
        getValue('btn').addEventListener('click', clicked);
        getValue('retry-btn').addEventListener('click', retry);
    })();
