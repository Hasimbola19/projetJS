// RAKOTOSON Hasimbola
// LEGRAND Sophie
// SHANOUFI Badreddine

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables ===
var total = 0;
var catalogSelection;

// function called when page is loaded
var init = function () {
    createShop();
    loadPanierFromLocalStorage();
};

window.addEventListener("load", init);

// usefull functions

/*
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
*/
var createShop = function () {
    var shop = document.getElementById("boutique");
    for (var i = 0; i < catalog.length; i++) {
        shop.appendChild(createProduct(catalog[i], i));
    }
};

/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
var createProduct = function (product, index) {
    // Build the div element for product
    var block = document.createElement("div");
    block.className = "produit";
    // set the id for this product
    block.id = index + "-" + productIdKey;

    // build the h4 part of 'block'
    block.appendChild(createBlock("h4", product.name));

    // /!\ should add the figure of the product... does not work yet... /!\ 
    block.appendChild(createFigureBlock(product));

    // build and add the div.description part of 'block' 
    block.appendChild(createBlock("div", product.description, "description"));

    // build and add the div.price part of 'block'
    block.appendChild(createBlock("div", product.price, "prix"));

    // build and add control div block to product element
    block.appendChild(createOrderControlBlock(index));

    return block;
};

/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function (tag, content, cssClass) {
    var element = document.createElement(tag);
    if (cssClass) {
        element.className = cssClass;
    }
    element.innerHTML = content;
    return element;
};

/*
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling, 
*   /!\  in this version button and input do nothing  /!\  
*/
var createOrderControlBlock = function (index) {
    var control = document.createElement("div");
    control.className = "controle";

    // create input quantity element
    var input = document.createElement("input");
    input.id = index + '-' + inputIdKey;
    input.type = "number";
    input.step = "1";
    input.value = "0";
    input.min = "0";
    input.max = MAX_QTY.toString();
    control.appendChild(input);

    // create order button
    var button = document.createElement("button");
    button.className = 'commander';
    button.id = index + "-" + orderIdKey;

    // add control to control as its child
    control.appendChild(button);

	// Event handler for input
    input.addEventListener("input", function () {
        var quantity = parseInt(input.value);
        if (!isNaN(quantity) && quantity > 0) {
          button.style.opacity = "1";
          button.style.cursor = "pointer"; // Change cursor to pointer when quantity is greater than 0
        } else {
          buttonStyle(button);
        }
    });

    // Event handler for button
    button.addEventListener("click", function () {
        var quantity = parseInt(input.value);
        if (!isNaN(quantity) && quantity > 0) {
            var price = catalog[index].price;
            total += price * quantity;
            addToPanier(index, quantity);
            buttonStyle(button);
            input.value = "0";
            // alert(`${quantity} ${catalog[index].name} ajoute au panier. Pour un total de: ${total.toFixed(2)}`);
        } else {
            alert("La quantite ne peut pas etre inferieure a 1");
        }
    });

    return control;
};

// Function to change the style of the button
var buttonStyle = function(button){
    button.style.opacity = "0.25";
    button.style.cursor = "wait";
}

/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*
* TODO : write the correct code
*/
var createFigureBlock = function (product) {
    var figure = document.createElement("figure");

    var img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    figure.appendChild(img);

    return figure;
};


// === Global Variables for Panier ===
let cart = {};

/* Update the cart display */
const updatePanier = function () {
  const cartContainer = document.querySelector("#panier .achats");
  const totalElement = document.querySelector("#panier #montant");
  
  cartContainer.innerHTML = '';
  
  let totalAmount = 0;
  
  for (let cartClef in cart) {
    const product = cart[cartClef];
    const productTotal = product.price * product.quantity;
    totalAmount += productTotal;

    // Create cart item element
    const cartItem = createCartItem(product, cartClef);
    cartContainer.appendChild(cartItem);
  }
  
  // Update total in the cart
  totalElement.innerText = totalAmount.toFixed(2);
  savePanierToLocalStorage();
};

/* Create a cart item element */
const createCartItem = function (product, cartClef) {
    /**
     * Create the div element inside the panier div
     */

    const div = document.createElement("div");
    div.className = "achat";
    /**
     * Set the id (id modifier en cartClef) of card item from the product id
     */

    div.id = `${cartClef}-achat`;

    /**
     * Make the figure for the cart, using the product from the boutique
     */
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    figure.appendChild(img);
    div.appendChild(figure);

    /**
     * The same as the boutique, but for the cart we use instead the same description when we handle the button add to cart
     */
    div.appendChild(createBlock("h4", product.name));

    /**
     * Quantity of the product from the boutique
     */
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = product.quantity;
    quantityInput.min = "1";
    quantityInput.max = MAX_QTY.toString();
    quantityInput.addEventListener("input", function () {
        updateCartItemQuantity(cartClef, parseInt(quantityInput.value), quantityInput.catalogSelect);
    });
    div.appendChild(quantityInput);

    /**
     * The price from the product of the boutique
     */
    const productTotal = product.price * product.quantity;

    div.appendChild(createBlock("div", `${product.price}`, "prix"));
    /**
     * Create remove button for cart, using event listener
     */
    const removeBtn = document.createElement("button");
    removeBtn.className = "retirer";
    removeBtn.addEventListener("click", function () {
        removeFromPanier(cartClef);
    });
    div.appendChild(removeBtn);

    return div;
};

/**
 * Function to add product to the cart, that we called when we create an orderBlock, 
 * here we take the product index and the quantity of the product
 */
const addToPanier = function (productIndex, quantity) {
  const product = catalog[productIndex];
  /**
   * Création d'une clé composé du catalogue et de l'index du produit.
   * Elle servira ensuite à comparer les produits pour savoir s'il faut l'ajouter ou
   * mettre à jour le panier
   **/
  const cartClef = `${catalogSelection}-${productIndex}`;
  /**  
   * variable temporaire pour la vérification de quantité max du panier : tempQuantity
   * si tempQuantity supérieur à 9, un message d'alert est émit.
  */
  let tempQuantity;
  if (cart[cartClef]) {
    tempQuantity = cart[cartClef].quantity + quantity;
    if (tempQuantity <= MAX_QTY){
        cart[cartClef].quantity += quantity;
    }
    else {
		alert("La quantité maximum pour un même article est de 9");
	}
  } else {
	if (quantity >MAX_QTY){
		alert("La quantité maximum pour un même article est de 9");
	} else {
		cart[cartClef] = {
			name: product.name,
			image: product.image,
			price: product.price,
			quantity: quantity,
      catalog: catalogSelection
		  };
	}

  }
  updatePanier();
};

/* Remove a product from the panier */
const removeFromPanier = function (cartClef) {
  delete cart[cartClef];
  updatePanier();
};

/* Update the quantity of a cart item */
const updateCartItemQuantity = function (cartClef, quantity) {
  if (cart[cartClef]) {
    if (quantity > 0 && quantity <= MAX_QTY) {
      cart[productIndex].quantity = quantity;
      updatePanier();
    } else {
      alert("La quantité doit être comprise entre 1 et " + MAX_QTY);
    }
  }
};

// Function to load JSON file and update the catalog
const loadCatalog = function (fileName) {
    const script = document.createElement('script');
    script.src = `data/${fileName}`;
    script.onload = function () {
      createShop();
    };
    document.head.appendChild(script);
  };

 /**
  * Function to search, filter products
  *  */ 
const search = function () {
    const searchValue = document.getElementById("filter").value;
    const shop = document.getElementById("boutique");
    shop.innerHTML = "";
    for (var i = 0; i < catalog.length; i++) {
      if (catalog[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
        shop.appendChild(createProduct(catalog[i], i));
      }
    }
    createShop();
}
  
/**
 * Event to load the page automatically, when key pressed in filter section
 */
document.addEventListener('DOMContentLoaded', function () {
const filter = document.getElementById("filter");

/**
 * Call the search function when the input value changes
 */
filter.addEventListener("input", function (event) {
    search(); // Appelle la fonction de recherche à chaque changement de valeur
});

/**
 * Show the value of the key pressed in the console
 */
filter.addEventListener("keyup", function (event) {
    console.log(event.key); // Affiche la touche pressée dans la console
});

// Function to create a dropdown list of catalog files
const catalogListeDeroulante = function () {
    const dataFiles = ['catalog1.js', 'catalog2.js', 'catalog3.js', 'catalog4.js'];
    const select = document.createElement('select');
    //select.id = 'catalogSelect';

    dataFiles.forEach(file => {
    const option = document.createElement('option');
    option.value = file;
    option.text = file;
    select.appendChild(option);
    });

    //Initialise la variable catalogSelection
    catalogSelection = dataFiles[0];

    select.addEventListener('change', function () {
      //récupération du catalogue sélectionné pour les mise à jour du panier
      catalogSelection = this.value;
      document.getElementById('boutique').innerHTML = '';
      loadCatalog(this.value);
    });

    document.body.insertBefore(select, document.getElementById('boutique'));
};

// Call the function to create the dropdown list
catalogListeDeroulante();

// Add save cart button
const saveCartButton = document.createElement('button');
saveCartButton.innerText = "Sauvegarder le panier";
saveCartButton.addEventListener('click', savePanierToLocalStorage);
document.body.insertBefore(saveCartButton, document.getElementById('boutique'));

});

/* Save the cart to localStorage */
const savePanierToLocalStorage = function () {
  localStorage.setItem('cart', JSON.stringify(cart));
};

/* Load the cart from localStorage */
const loadPanierFromLocalStorage = function () {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updatePanier();
  }
};