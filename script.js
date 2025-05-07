/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedProductsList = document.getElementById("selectedProductsList");

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
    </div>
  `
    )
    .join("");

  // Add click event listener for product selection
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((productCard, index) => {
    productCard.addEventListener("click", () =>
      handleProductSelection(productCard, products[index])
    );
  });
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);
});

/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("productsContainer");
  const selectedProductsList = document.getElementById("selectedProductsList");
  const categoryFilter = document.getElementById("categoryFilter");

  // Show placeholder message initially
  productsContainer.innerHTML = `
    <div class="placeholder-message">
      Select a category to view products
    </div>
  `;

  // Function to handle product selection
  const handleProductSelection = (productCard, product) => {
    if (productCard.classList.contains("selected")) {
      productCard.classList.remove("selected");
      // Remove product from selected list
      const selectedItem = selectedProductsList.querySelector(
        `[data-id="${product.id}"]`
      );
      if (selectedItem) selectedItem.remove();
    } else {
      productCard.classList.add("selected");
      // Add product to selected list
      const selectedItem = document.createElement("div");
      selectedItem.classList.add("selected-item");
      selectedItem.setAttribute("data-id", product.id);
      selectedItem.innerHTML = `
         <img src="${product.image}" alt="${product.name}" />
              <div class="product-info">
                <h3>${product.brand}</h3>
                <p>${product.name}</p>
              </div>
      `;
      selectedProductsList.appendChild(selectedItem);
    }
  };

  // Fetch products and render them based on category
  categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;

    fetch("products.json")
      .then((response) => response.json())
      .then((data) => {
        const filteredProducts = data.products.filter(
          (product) => product.category === selectedCategory
        );

        if (filteredProducts.length > 0) {
          productsContainer.innerHTML = "";
          filteredProducts.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
              <img src="${product.image}" alt="${product.name}" />
              <div class="product-info">
                <h3>${product.brand}</h3>
                <p>${product.name}</p>
              </div>
            `;
            productCard.addEventListener("click", () =>
              handleProductSelection(productCard, product)
            );
            productsContainer.appendChild(productCard);
          });
        } else {
          productsContainer.innerHTML = `
            <div class="placeholder-message">
              No products found for the selected category
            </div>
          `;
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  });
});
