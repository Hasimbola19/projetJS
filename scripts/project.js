// RAKOTOSON Hasimbola
// LEGRAND Sophie

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables ===
var total = 0;

// function called when page is loaded, it performs initializations 
var init = function () {
	createShop();
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

	// Event handler for button
	button.addEventListener("click", function () {
		var quantity = parseInt(input.value);
		if (!isNaN(quantity) && quantity > 0) {
			var price = catalog[index].price;
			total += price * quantity;
			addToPanier(index, quantity);
			// alert(`${quantity} ${catalog[index].name} ajoute au panier. Pour un total de: ${total.toFixed(2)}`);
		} else {
			alert("La quantite ne peut pas etre inferieure a 1");
		}
	});

	return control;
};

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

/* Update the panier (cart) display */
const updatePanier = function () {
  const cartContainer = document.querySelector("#panier .achats");
  const totalElement = document.querySelector("#panier #montant");
  
  cartContainer.innerHTML = '';
  
  let totalAmount = 0;
  
  for (let id in cart) {
    const product = cart[id];
    const productTotal = product.price * product.quantity;
    totalAmount += productTotal;

    // Create cart item element
    const cartItem = createCartItem(product, id);
    cartContainer.appendChild(cartItem);
  }
  
  // Update total in the cart
  totalElement.innerText = totalAmount.toFixed(2);
};

/* Create a cart item element */
const createCartItem = function (product, id) {
	/**
	 * Create the div element inside the panier div
	 */

	const div = document.createElement("div");
	div.className = "achat";
	/**
	 * Set the id of card item from the product id
	 */

	div.id = `${id}-achat`;

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
	div.appendChild(createBlock("div", `${product.quantity}`, "quantite"));

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
		removeFromPanier(id);
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
  if (cart[productIndex]) {
    cart[productIndex].quantity += quantity;
  } else {
    cart[productIndex] = {
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity
    };
  }
  updatePanier();
};

/* Remove a product from the panier */
const removeFromPanier = function (productIndex) {
  delete cart[productIndex];
  updatePanier();
};