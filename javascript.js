// Dark mode
const checkbox = document.getElementById('checkbox');

// Check if the user has a preference for dark mode stored
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
  document.body.classList.add('dark');
  checkbox.checked = true;
}

checkbox.addEventListener('change', () => {
  // Toggle the dark mode class on the body element
  document.body.classList.toggle('dark');

  // Store the user's preference for dark mode
  if (checkbox.checked) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Preloader
var preloader = document.querySelector(".preloader");

window.addEventListener("load", vanish);

function vanish() {
  preloader.classList.add("disappear");
}

// Add to Cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

// Cart Open
cartIcon.onclick = () => {
  cart.classList.add("active");
};

// Cart Close
closeCart.onclick = () => {
  cart.classList.remove("active");
};

// Cart Working JS
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

// Check if there are any items stored in localStorage
let cartItems = [];
const storedCartItems = localStorage.getItem('cartItems');
if (storedCartItems) {
  cartItems = JSON.parse(storedCartItems);
  updateCartUI();
}

// making function
function ready() {
  // Remove Items From Cart
  var removeCartButtons = document.getElementsByClassName("cart-remove");
  console.log(removeCartButtons);
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  // Quantity Changes
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }


  // Add To Cart
  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
  // Buy Button Work
  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}

// Buy Button
function buyButtonClicked() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  if (cartContent.children.length === 0) {
    alert("Please add something to cart");
    return;
  }

  window.open('checkout-page.html');

  while (cartContent.hasChildNodes()) {
    cartContent.removeChild(cartContent.firstChild);
  }

  
  
}

// Remove Items From Cart
function removeCartItem(event) {
  var buttonClicked = event.target;
  var cartBox = buttonClicked.parentElement;
  var title = cartBox.getElementsByClassName("cart-product-title")[0].innerText;

  // Find the index of the item to be removed
  var index = -1;
  for (var i = 0; i < cartItems.length; i++) {
    if (cartItems[i].title === title) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    // Remove the item from the cartItems array
    cartItems.splice(index, 1);
    updateCartUI();
  }
}

// Quantity Changes
function quantityChanged(event) {
  var input = event.target;
  var cartBox = input.parentElement.parentElement;
  var title = cartBox.getElementsByClassName("cart-product-title")[0].innerText;
  var quantity = parseInt(input.value);

  // Find the item in the cartItems array
  for (var i = 0; i < cartItems.length; i++) {
    if (cartItems[i].title === title) {
      // Update the quantity
      cartItems[i].quantity = quantity;
      break;
    }
  }

  updateCartUI();
}

// Add To Cart
function addCartClicked(event) {
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImg = shopProducts.getElementsByClassName("product-img")[0].src;

  // Find the item in the cartItems array
  var existingItem = cartItems.find((item) => item.title === title);

  if (existingItem) {
    alert("You have already added this item to the cart");
    return;
  }

  // Create a new item object
  var item = {
    title: title,
    price: price,
    productImg: productImg,
    quantity: 1
  };

  // Add the item to the cartItems array
  cartItems.push(item);
  updateCartUI();
}

function updateCartUI() {
  
  var cartContent = document.getElementsByClassName("cart-content")[0];
  cartContent.innerHTML = "";

  cartItems.forEach(function(item) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");

    var cartBoxContent = `
      <img src="${item.productImg}" alt="" class="cart-img">
      <div class="detail-box">
        <div class="cart-product-title">${item.title}</div>
        <div class="cart-price">${item.price}</div>
        <input type="number" min="1" value="${item.quantity}" class="cart-quantity">
      </div>
      <!-- Remove Cart -->
      <i class="fa-solid fa-trash cart-remove"></i>
    `;
    cartShopBox.innerHTML = cartBoxContent;
    cartContent.append(cartShopBox);

    cartShopBox
      .getElementsByClassName("cart-remove")[0]
      .addEventListener("click", removeCartItem);
    cartShopBox
      .getElementsByClassName("cart-quantity")[0]
      .addEventListener("change", quantityChanged);
  });

  // Store the cartItems array in localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  updatetotal();
}

// Update Total
function updatetotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace(/[^0-9.-]+/g, ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  // If price contains some cents value
  total = Math.round(total * 100) / 100;

  var formattedTotal = total.toLocaleString(undefined, {
    style: "currency",
    currency: "PHP"
  });

  document.getElementsByClassName("total-price")[0].innerText = formattedTotal;
}


