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


        /* =================================================
           FIREBASE-LA PRODUCTS ILLANA
           EXISTING WEBSITE PRODUCTS REMAIN
        ================================================= */

        if (snapshot.empty) {

            console.log(
                "No Firebase products. Existing products kept."
            );

            return;
        }


        const products = [];


        /* =================================================
           GET FIREBASE PRODUCTS
        ================================================= */

        snapshot.forEach(function (doc) {

            products.push({
                id: doc.id,
                ...doc.data()
            });

        });


        console.log(
            "Firebase products:",
            products
        );


        /* =================================================
           CATEGORY → EXISTING WEBSITE PANEL
        ================================================= */

        const categoryMap = {

            /* KUNDAN */

            "Bangles": "kundan-bangles",

            "Earrings": "kundan-earrings",

            "Necklaces": "kundan-necklaces",

            "Hair Accessories": "kundan-hair-accessories",

            "Combo": "kundan-combo",

            "Kids": "kundan-kids",


            /* CROCHET */

            "Handbags": "crochet-handbags",

            "Keychains": "crochet-keychains",

            "Toys": "crochet-toys",

            "Bouquets": "crochet-bouquets"

        };


        /* =================================================
           RENDER FIREBASE PRODUCTS
        ================================================= */

        products.forEach(function (product) {


            /* =================================================
               AVAILABLE FALSE → DON'T DISPLAY
            ================================================= */

            if (product.available === false) {
                return;
            }


            const category =
                product.category || "";


            let panelId =
                categoryMap[category];


            /* =================================================
               CROCHET HAIR ACCESSORIES
               SAME CATEGORY NAME EXISTS IN KUNDAN
            ================================================= */

            if (
                product.mainCategory === "Crochet" &&
                category === "Hair Accessories"
            ) {

                panelId =
                    "crochet-hair-accessories";

            }


            /* =================================================
               CATEGORY NOT FOUND
            ================================================= */

            if (!panelId) {

                console.warn(
                    "Category not mapped:",
                    category
                );

                return;
            }


            /* =================================================
               FIND EXISTING PANEL
            ================================================= */

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


            /* =================================================
               FIND PRODUCT GRID
            ================================================= */

            const grid =
                panel.querySelector(
                    ".product-grid"
                );


            if (!grid) {

                console.warn(
                    "Product grid not found:",
                    panelId
                );

                return;
            }


            /* =================================================
               CREATE PRODUCT CARD
            ================================================= */

            const card =
                document.createElement("article");


            card.className =
                "product-card";


            /* =================================================
               PRODUCT IMAGE
            ================================================= */

            let image =
                "images/hero.jpg";


            if (product.image) {

                if (
                    product.image.startsWith("http")
                ) {

                    image =
                        product.image;

                }

                else if (
                    product.image.startsWith("images/")
                ) {

                    image =
                        product.image;

                }

                else {

                    image =
                        "images/" +
                        product.image;

                }

            }


            /* =================================================
               PRODUCT PRICE
            ================================================= */

            const price =
                product.price ||
                "DM for price details";


            /* =================================================
               PRODUCT NAME
            ================================================= */

            const name =
                product.name ||
                "MJ WORKS Product";


            /* =================================================
               PRODUCT CARD HTML
            ================================================= */

            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${image}"
                        alt="${name}"
                    >

                    <img
                        src="images/hero.jpg"
                        class="product-watermark"
                        alt="MJ WORKS"
                    >

                    <button
                        class="heart-btn"
                        type="button"
                    >
                        ♡
                    </button>

                </div>


                <div class="product-info">

                    <h4>
                        ${name}
                    </h4>

                    <p class="product-price">
                        ${price}
                    </p>

                    <button
                        class="order-btn"
                        type="button"
                    >
                        Order on WhatsApp
                    </button>

                </div>

            `;


            /* =================================================
               HEART BUTTON
            ================================================= */

            const heart =
                card.querySelector(
                    ".heart-btn"
                );


            if (heart) {

                heart.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        heart.classList.toggle(
                            "liked"
                        );


                        heart.innerHTML =
                            heart.classList.contains(
                                "liked"
                            )
                                ? "♥"
                                : "♡";

                    }
                );

            }


            /* =================================================
               PRODUCT CARD CLICK
               → EXISTING MODAL
            ================================================= */

            card.addEventListener(
                "click",
                function (event) {

                    /* Heart click → don't open modal */

                    if (
                        event.target.closest(
                            ".heart-btn"
                        )
                    ) {

                        return;

                    }


                    /* Order button → handled separately */

                    if (
                        event.target.closest(
                            ".order-btn"
                        )
                    ) {

                        return;

                    }


                    openFirebaseProductModal(
                        card
                    );

                }
            );


            /* =================================================
               ORDER BUTTON
               → EXISTING MODAL
            ================================================= */

            const orderButton =
                card.querySelector(
                    ".order-btn"
                );


            if (orderButton) {

                orderButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        openFirebaseProductModal(
                            card
                        );

                    }
                );

            }


            /* =================================================
               ADD FIREBASE CARD
               WITHOUT REMOVING OLD PRODUCTS
            ================================================= */

            grid.appendChild(card);

        });


        console.log(
            "Firebase products successfully added to website ❤️"
        );


    }

    catch (error) {

        console.error(
            "Firebase product loading failed:",
            error
        );

    }

});


/* =====================================================
   FIREBASE PRODUCT → EXISTING WEBSITE MODAL
===================================================== */

function openFirebaseProductModal(card) {

    /*
       script.js-la existing openProductModal()
       function-a global-ah expose panniruppom.

       Adha use pannina:

       ✓ Product name
       ✓ Price
       ✓ Image
       ✓ Quantity
       ✓ Bangle size
       ✓ WhatsApp order

       ellam existing system-la work aagum.
    */

    if (
        typeof window.openProductModal === "function"
    ) {

        window.openProductModal(card);

    }

    else {

        console.error(
            "Existing product modal function not available."
        );

    }

}