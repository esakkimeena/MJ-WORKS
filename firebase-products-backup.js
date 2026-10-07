import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =====================================================
   FIREBASE PRODUCTS → WEBSITE
===================================================== */

document.addEventListener("DOMContentLoaded", async function () {

    console.log("Firebase Products Loading...");

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        /* Firebase-la products illana
           existing website products apdiye irukkum */
        if (snapshot.empty) {
            console.log("No Firebase products. Existing products kept.");
            return;
        }

        const products = [];

        snapshot.forEach(function (doc) {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log("Firebase products:", products);


        /* =================================================
           CATEGORY → EXISTING WEBSITE PANEL
        ================================================= */

        const categoryMap = {

            "Bangles": "kundan-bangles",
            "Earrings": "kundan-earrings",
            "Necklaces": "kundan-necklaces",
            "Hair Accessories": "kundan-hair-accessories",
            "Combo": "kundan-combo",
            "Kids": "kundan-kids",

            "Handbags": "crochet-handbags",
            "Keychains": "crochet-keychains",
            "Toys": "crochet-toys",
            "Bouquets": "crochet-bouquets"

        };


        /* =================================================
           RENDER FIREBASE PRODUCTS
        ================================================= */

        products.forEach(function (product) {

            if (product.available === false) {
                return;
            }

            let category = product.category || "";

            let panelId = categoryMap[category];


            /* Optional mainCategory support */

            if (
                product.mainCategory === "Crochet" &&
                category === "Hair Accessories"
            ) {
                panelId = "crochet-hair-accessories";
            }


            if (!panelId) {
                console.warn(
                    "Category not mapped:",
                    category
                );
                return;
            }


            const panel =
                document.querySelector(
                    `[data-panel="${panelId}"]`
                );


            if (!panel) {
                console.warn(
                    "Panel not found:",
                    panelId
                );
                return;
            }


            const grid =
                panel.querySelector(".product-grid");


            if (!grid) return;


            /* =================================================
               PRODUCT CARD
            ================================================= */

            const card =
                document.createElement("article");

            card.className = "product-card";


            const image =
                product.image
                    ? (
                        product.image.startsWith("http")
                            ? product.image
                            : (
                                product.image.startsWith("images/")
                                    ? product.image
                                    : "images/" + product.image
                            )
                    )
                    : "images/hero.jpg";


            const price =
                product.price ||
                "DM for price details";


            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${image}"
                        alt="${product.name || "MJ WORKS Product"}"
                    >

                    <img
                        src="images/hero.jpg"
                        class="product-watermark"
                        alt="MJ WORKS"
                    >

                    <button class="heart-btn">
                        ♡
                    </button>

                </div>

                <div class="product-info">

                    <h4>
                        ${product.name || "MJ WORKS Product"}
                    </h4>

                    <p class="product-price">
                        ${price}
                    </p>

                    <button class="order-btn">
                        Order on WhatsApp
                    </button>

                </div>
            `;


            /* =================================================
               HEART BUTTON
            ================================================= */

            const heart =
                card.querySelector(".heart-btn");

            heart.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                heart.classList.toggle("liked");

                heart.innerHTML =
                    heart.classList.contains("liked")
                        ? "♥"
                        : "♡";

            });


            /* =================================================
               PRODUCT MODAL
            ================================================= */

            card.addEventListener("click", function (event) {

                if (
                    event.target.closest(".heart-btn") ||
                    event.target.closest(".order-btn")
                ) {
                    return;
                }

                openFirebaseProductModal(card);

            });


            /* =================================================
               ORDER BUTTON
            ================================================= */

            const orderButton =
                card.querySelector(".order-btn");

            orderButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    openFirebaseProductModal(card);

                }
            );


            grid.appendChild(card);

        });


        console.log(
            "Firebase products successfully added to website ❤️"
        );


    } catch (error) {

        console.error(
            "Firebase product loading failed:",
            error
        );

        /* IMPORTANT:
           Firebase fail aana existing website
           products remain untouched */
    }

});


/* =====================================================
   FIREBASE PRODUCT MODAL
===================================================== */

function openFirebaseProductModal(card) {

    const modal =
        document.getElementById("productModal");

    if (!modal) return;


    const name =
        card.querySelector(
            ".product-info h4"
        )?.textContent.trim() || "";


    const price =
        card.querySelector(
            ".product-price"
        )?.textContent.trim() ||
        "DM for price details";


    const image =
        card.querySelector(
            ".product-image > img:not(.product-watermark)"
        );


    const modalImage =
        document.getElementById(
            "modalProductImage"
        );

    const modalName =
        document.getElementById(
            "modalProductName"
        );

    const modalPrice =
        document.getElementById(
            "modalProductPrice"
        );


    if (modalImage && image) {
        modalImage.src = image.src;
        modalImage.alt = name;
    }

    if (modalName) {
        modalName.textContent = name;
    }

    if (modalPrice) {
        modalPrice.textContent = price;
    }


    /* Reset quantity */

    const qty =
        document.getElementById("productQty");

    if (qty) {
        qty.textContent = "1";
    }


    /* Firebase bangle detection */

    const bangleBox =
        document.getElementById(
            "bangleSizeBox"
        );

    if (bangleBox) {

        if (
            card.closest(
                '[data-panel="kundan-bangles"]'
            )
        ) {
            bangleBox.classList.add("show");
        } else {
            bangleBox.classList.remove("show");
        }

    }


    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}