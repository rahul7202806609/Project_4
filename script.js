document.addEventListener("DOMContentLoaded", () => {
  fetch("api/products.json")
    .then(response => response.json())
    .then(productData => {
      const template = document.getElementById("productTemplate");
      const productContainer = document.getElementById("productContainer");

      if (template && productContainer) {
        productData.forEach(product => {
          const clone = template.content.cloneNode(true);

          clone.querySelector(".category").textContent = product.category;
          clone.querySelector(".productImage").src = product.image;
          clone.querySelector(".productImage").alt = product.name;
          clone.querySelector(".productName").textContent = product.name;
          clone.querySelector(".productDescription").textContent = product.description;
          clone.querySelector(".productPrice").textContent = `₹${product.price}`;
          clone.querySelector(".productActualPrice").textContent = `₹${product.price * 4}`;
          clone.querySelector(".productStock").textContent = product.stock;

          let quantityElem = clone.querySelector(".productQuantity");
          let quantity = 1; // Default quantity

          // Handle Increment
          clone.querySelector(".cartIncrement").addEventListener("click", () => {
            if (quantity < product.stock) { // Ensure not exceeding available stock
              quantity++;
              quantityElem.textContent = quantity;
            }
          });

          // Handle Decrement
          clone.querySelector(".cartDecrement").addEventListener("click", () => {
            if (quantity > 1) {
              quantity--;
              quantityElem.textContent = quantity;
            }
          });

          // Handle Add to Cart
          clone.querySelector(".add-to-cart-button").addEventListener("click", () => {
            addToCart(product, quantity);
            showToast("add", product.name);
          });

          productContainer.appendChild(clone);
        });
      }
    })
    .catch(error => console.error("Error loading JSON:", error));

    function addToCart(product, quantity) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
      
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
      
        if (existingProductIndex !== -1) {
          cart[existingProductIndex].quantity += quantity;
        } else {
          cart.push({ ...product, quantity });
        }
      
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
      }

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        document.getElementById("cartValue").innerHTML = `<i class='fa-solid fa-cart-shopping'></i> ${cart.length}`;
      }
      updateCartCount();
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
