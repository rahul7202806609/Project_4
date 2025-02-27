document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("productCartContainer");
  const cartTemplate = document.getElementById("productCartTemplate");
  const subTotalElem = document.querySelector(".productSubTotal");
  const finalTotalElem = document.querySelector(".productFinalTotal");
  const taxAmount = 50;

  function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";
    let subTotal = 0;

    cart.forEach(product => {
      const clone = cartTemplate.content.cloneNode(true);
      
      clone.querySelector(".category").textContent = product.category;
      clone.querySelector(".productImage").src = product.image;
      clone.querySelector(".productImage").alt = product.name;
      clone.querySelector(".productName").textContent = product.name;
      clone.querySelector(".productPrice").textContent = `₹${product.price}`;
      const quantityElem = clone.querySelector(".productQuantity");
      quantityElem.textContent = product.quantity;
      
      subTotal += product.price * product.quantity;
      
      // Handle Increment
      clone.querySelector(".cartIncrement").addEventListener("click", () => {
        product.quantity++;
        updateCart(cart);
        showToast("add", product.name);
      });

      // Handle Decrement
      clone.querySelector(".cartDecrement").addEventListener("click", () => {
        if (product.quantity > 1) {
          product.quantity--;
          updateCart(cart);
          showToast("remove", product.name);
        }
      });

      // Handle Remove from Cart
      clone.querySelector(".remove-to-cart-button").addEventListener("click", () => {
        const index = cart.findIndex(item => item.id === product.id);
        cart.splice(index, 1);
        updateCart(cart);
        showToast("remove", product.name);
      });

      cartContainer.appendChild(clone);
    });
    
    subTotalElem.textContent = `₹${subTotal}`;
    finalTotalElem.textContent = `₹${subTotal + taxAmount}`;
  }

  function updateCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById("cartValue").innerHTML = `<i class='fa-solid fa-cart-shopping'></i> ${cart.length}`;
    loadCart();
  }

  loadCart();
});
function showToast(operation, productName) {
    const toast = document.createElement("div");
    toast.classList.add("toast");

    // Set the text content of the toast based on the operation
    if (operation === "add") {
      toast.textContent = `${productName} has been added to the cart.`;
      toast.classList.add("toast-success");
    } else {
      toast.textContent = `${productName} has been removed from the cart.`;
      toast.classList.add("toast-error");
    }

    document.body.appendChild(toast);

    // Automatically remove the toast after 2 seconds
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }
