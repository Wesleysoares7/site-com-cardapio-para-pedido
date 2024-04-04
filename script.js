const menu = document.querySelector("#menu");
const cartBnt = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#cart-modal");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const checkoutBtn = document.querySelector("#checkout-btn");
const closeModalBtn = document.querySelector("#close-modal-btn");
const cartCounter = document.querySelector("#cart-count");
const addressInput = document.querySelector("#address");
const addressWarn = document.querySelector("#address-warn");
const spanItem = document.querySelector("#date-span");

let cart = [];

cartBnt.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCard(name, price);
  }
});

addToCard = (name, price) => {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
};

updateCartModal = () => {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class+"font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

          <button  class="remove-from-cart-btn bg-red-500 px-5 rounded text-white" data-name="${
            item.name
          }">
            Remover
          </button>
      </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
};

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

removeItemCart = (name) => {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
};

addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.valeu;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", () => {
  // const isOpen = checkRestaurantOpen();
  // if (!isOpen) {
  //   Toastify({
  //     text: "Ops, o restaurante está fechado",
  //     duration: 3000,
  //     close: true,
  //     gravity: "top",
  //     position: "left",
  //     stopOnFocus: true,
  //     style: {
  //       background: "#ef4444",
  //     },
  //   }).showToast();

  //   return;
  // }
  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }
  const cartItem = cart
    .map((item) => {
      return ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItem);
  const phone = "86981825254";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );
  cart = [];
  updateCartModal();
});

checkRestaurantOpen = () => {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
};

const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
