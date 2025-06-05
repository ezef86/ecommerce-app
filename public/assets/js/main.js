// public/assets/js/main.js
document.addEventListener("DOMContentLoaded", () => {
	let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

	const updateCartCount = () => {
		const cartCountElement = document.getElementById("cart-count");
		if (cartCountElement) {
			cartCountElement.textContent = cart.reduce(
				(sum, item) => sum + item.quantity,
				0
			);
		}
	};

	const saveCart = () => {
		localStorage.setItem("shoppingCart", JSON.stringify(cart));
		updateCartCount();
		renderCartPageItems(); // Update cart page if currently viewing it
	};

	const addToCart = (product) => {
		const existingItem = cart.find(
			(item) => item.productId === product.productId
		);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			cart.push({ ...product, quantity: 1 });
		}
		saveCart();
		alert(`${product.productName} added to cart!`);
	};

	// Event listener for "Add to Cart" buttons (on products page or cards)
	document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
		button.addEventListener("click", (event) => {
			const card = event.target.closest(".product-card");
			if (!card) return;

			const productId = card.dataset.productId;
			const productName = card.dataset.productName;
			const productPrice = parseFloat(card.dataset.productPrice);
			const productImage = card.dataset.productImage; // Get image URL

			if (productId && productName && !isNaN(productPrice)) {
				addToCart({ productId, productName, productPrice, productImage });
			} else {
				console.error("Product data missing from card:", card.dataset);
			}
		});
	});

	// --- Cart Page Specific Logic ---
	const cartItemsContainer = document.getElementById("cart-items-container");
	const cartTotalElement = document.getElementById("cart-total");
	const emptyCartMessage = document.getElementById("empty-cart-message");
	const cartSummaryDiv = document.getElementById("cart-summary");
	const checkoutForm = document.getElementById("checkout-form");
	const checkoutMessageDiv = document.getElementById("checkout-message");

	const renderCartPageItems = () => {
		if (!cartItemsContainer || !cartTotalElement) return; // Only run on cart page

		cartItemsContainer.innerHTML = ""; // Clear existing items
		let total = 0;

		if (cart.length === 0) {
			if (emptyCartMessage) emptyCartMessage.style.display = "block";
			if (cartSummaryDiv) cartSummaryDiv.style.display = "none";
			cartItemsContainer.appendChild(
				emptyCartMessage || document.createElement("p")
			);
		} else {
			if (emptyCartMessage) emptyCartMessage.style.display = "none";
			if (cartSummaryDiv) cartSummaryDiv.style.display = "block";

			const ul = document.createElement("ul");
			ul.className = "list-group";

			cart.forEach((item, index) => {
				const li = document.createElement("li");
				li.className =
					"list-group-item d-flex justify-content-between align-items-center";

				const itemImage = item.productImage
					? `<img src="${item.productImage}" alt="${item.productName}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">`
					: "";

				li.innerHTML = `
                    <div>
                        ${itemImage}
                        ${item.productName} (x${item.quantity})
                    </div>
                    <div>
                        <span>$${(item.productPrice * item.quantity).toFixed(
													2
												)}</span>
                        <button class="btn btn-sm btn-outline-secondary ms-2 update-quantity-btn" data-index="${index}" data-change="-1">-</button>
                        <button class="btn btn-sm btn-outline-secondary ms-1 update-quantity-btn" data-index="${index}" data-change="1">+</button>
                        <button class="btn btn-sm btn-danger ms-2 remove-item-btn" data-index="${index}"><i class="bi bi-trash"></i></button>
                    </div>
                `;
				ul.appendChild(li);
				total += item.productPrice * item.quantity;
			});
			cartItemsContainer.appendChild(ul);
		}
		cartTotalElement.textContent = total.toFixed(2);
	};

	// Event delegation for cart item buttons
	if (cartItemsContainer) {
		cartItemsContainer.addEventListener("click", (event) => {
			const target = event.target.closest("button");
			if (!target) return;

			const index = parseInt(target.dataset.index);

			if (target.classList.contains("remove-item-btn")) {
				cart.splice(index, 1);
				saveCart();
			} else if (target.classList.contains("update-quantity-btn")) {
				const change = parseInt(target.dataset.change);
				cart[index].quantity += change;
				if (cart[index].quantity <= 0) {
					cart.splice(index, 1); // Remove if quantity is 0 or less
				}
				saveCart();
			}
		});
	}

	// Checkout Logic
	if (checkoutForm) {
		checkoutForm.addEventListener("submit", async (event) => {
			event.preventDefault();
			checkoutMessageDiv.innerHTML = ""; // Clear previous messages

			if (cart.length === 0) {
				checkoutMessageDiv.innerHTML =
					'<div class="alert alert-warning">Your cart is empty.</div>';
				return;
			}

			const customerName = document.getElementById("customerName").value;
			const customerEmail = document.getElementById("customerEmail").value;

			const orderData = {
				items: cart.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
					priceAtPurchase: item.productPrice, // Storing price at time of adding to cart
				})),
				totalAmount: parseFloat(cartTotalElement.textContent),
				customerInfo: {
					name: customerName,
					email: customerEmail,
				},
			};

			try {
				const response = await fetch("/api/carrito", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(orderData),
				});

				const result = await response.json();

				if (response.ok) {
					checkoutMessageDiv.innerHTML = `<div class="alert alert-success">Order placed successfully! Order ID: ${result.cart._id}</div>`;
					cart = []; // Empty the cart
					saveCart(); // Update localStorage and UI
					// Optionally redirect to an order confirmation page
					// window.location.href = `/order-confirmation/${result.cart._id}`;
				} else {
					checkoutMessageDiv.innerHTML = `<div class="alert alert-danger">Error placing order: ${
						result.message || "Unknown error"
					}</div>`;
				}
			} catch (error) {
				console.error("Checkout error:", error);
				checkoutMessageDiv.innerHTML = `<div class="alert alert-danger">An error occurred while trying to place your order. Please try again.</div>`;
			}
		});
	}

	// Initial cart rendering on page load
	updateCartCount();
	renderCartPageItems(); // This will correctly render the cart if on the cart page
});
