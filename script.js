/* =========================================================
   MJ WORKS - COMPLETE SCRIPT.JS
========================================================= */

async function getWhatsAppNumber() {
    try {
        const { db } = await import("./firebase-config.js");

        const { doc, getDoc } = await import(
            "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
        );

        const settingsRef = doc(db, "settings", "shop");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
            const data = settingsSnap.data();

            if (data.whatsappNumber) {
                return data.whatsappNumber.replace(/\D/g, "");
            }
        }
    } catch (error) {
        console.error("Failed to load WhatsApp number:", error);
    }

    return "916380554187";
}


document.addEventListener("DOMContentLoaded", function () {

    console.log("MJ WORKS JS LOADED");


    /* =====================================================
       CATEGORY SYSTEM
    ===================================================== */

    const categoryTabs =
        document.querySelectorAll(".category-tab");

    const categorySections =
        document.querySelectorAll(".category-section");


    categoryTabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const target =
                tab.getAttribute("data-target");

            const parentSection =
                tab.closest(".category-section");

            if (!parentSection) return;


            /* Remove active from tabs */

            parentSection
                .querySelectorAll(".category-tab")
                .forEach(function (item) {

                    item.classList.remove("active");

                });


            /* Hide panels */

            parentSection
                .querySelectorAll(".collection-panel")
                .forEach(function (panel) {

                    panel.classList.remove("active");

                });


            /* Activate selected tab */

            tab.classList.add("active");


            /* Show selected panel */

            const panel =
                parentSection.querySelector(
                    `[data-panel="${target}"]`
                );


            if (panel) {

                panel.classList.add("active");


                setTimeout(function () {

                    panel.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 100);

            }

        });

    });



    /* =====================================================
       BACK BUTTON
    ===================================================== */

    document
        .querySelectorAll(".back-btn")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const section =
                    button.closest(".category-section");

                if (!section) return;


                section
                    .querySelectorAll(".collection-panel")
                    .forEach(function (panel) {

                        panel.classList.remove("active");

                    });


                section
                    .querySelectorAll(".category-tab")
                    .forEach(function (tab) {

                        tab.classList.remove("active");

                    });


                const tabs =
                    section.querySelector(".category-tabs");


                if (tabs) {

                    tabs.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            });

        });



    /* =====================================================
       HEART BUTTON
    ===================================================== */

    document
        .querySelectorAll(".heart-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    button.classList.toggle("liked");


                    if (
                        button.classList.contains("liked")
                    ) {

                        button.innerHTML = "♥";

                    } else {

                        button.innerHTML = "♡";

                    }

                }
            );

        });



    /* =====================================================
       PRODUCT MODAL
    ===================================================== */

    const modal =
        document.getElementById("productModal");

    const closeModalBtn =
        document.getElementById(
            "closeProductModal"
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

    const sizeBox =
        document.getElementById(
            "bangleSizeBox"
        );

    const sizeSelect =
        document.getElementById(
            "bangleSize"
        );

    const qtyText =
        document.getElementById(
            "productQty"
        );

    const minusBtn =
        document.getElementById(
            "minusQty"
        );

    const plusBtn =
        document.getElementById(
            "plusQty"
        );

    const modalOrderBtn =
        document.getElementById(
            "modalOrderBtn"
        );


    let selectedProduct = {

        name: "",
        price: "",
        image: "",
        isBangle: false

    };


    let quantity = 1;



    /* =====================================================
       GET PRODUCT INFORMATION
    ===================================================== */

    function getProductInfo(card) {

        if (!card) return null;


        const nameElement =
            card.querySelector(
                ".product-info h4"
            );


        const priceElement =
            card.querySelector(
                ".product-price"
            );


        const imageElement =
            card.querySelector(
                ".product-image > img:not(.product-watermark)"
            );


        if (!nameElement || !imageElement) {

            return null;

        }


        const name =
            nameElement.textContent.trim();


        const price =
            priceElement
                ? priceElement.textContent.trim()
                : "DM for price details";


        /*
           Detect only Kundan Bangles
        */

        const banglePanel =
            card.closest(
                '[data-panel="kundan-bangles"]'
            );


        return {

            name: name,

            price: price,

            image: imageElement.src,

            isBangle: !!banglePanel

        };

    }



    /* =====================================================
       OPEN MODAL
    ===================================================== */

    function openProductModal(card) {

        if (!modal) {

            console.error(
                "productModal not found"
            );

            return;

        }


        const product =
            getProductInfo(card);


        if (!product) {

            console.error(
                "Product information not found"
            );

            return;

        }


        selectedProduct = product;



        /* Product image */

        if (modalImage) {

            modalImage.src =
                product.image;

            modalImage.alt =
                product.name;

        }



        /* Product name */

        if (modalName) {

            modalName.textContent =
                product.name;

        }



        /* Product price */

        if (modalPrice) {

            modalPrice.textContent =
                product.price;

        }



        /* Reset quantity */

        quantity = 1;


        if (qtyText) {

            qtyText.textContent = "1";

        }



        /* Reset size */

        if (sizeSelect) {

            sizeSelect.value = "";

        }



        /*
           Bangle = show size
           Everything else = hide size
        */

        if (sizeBox) {

            if (product.isBangle) {

                sizeBox.classList.add("show");

            } else {

                sizeBox.classList.remove("show");

            }

        }



        /* SHOW POPUP */

        modal.classList.add("active");

        document.body.style.overflow =
            "hidden";


        console.log(
            "Opened:",
            product.name
        );

    }


    /*
       Firebase products use this
    */

    window.openProductModal =
        openProductModal;



    /* =====================================================
       PRODUCT CARD CLICK
    ===================================================== */

    document
        .querySelectorAll(".product-card")
        .forEach(function (card) {

            card.addEventListener(
                "click",
                function (event) {


                    /*
                       Heart click -> don't open
                    */

                    if (
                        event.target.closest(
                            ".heart-btn"
                        )
                    ) {

                        return;

                    }


                    /*
                       Order button handled separately
                    */

                    if (
                        event.target.closest(
                            ".order-btn"
                        )
                    ) {

                        return;

                    }


                    openProductModal(card);

                }
            );

        });



    /* =====================================================
       ORDER BUTTON -> OPEN MODAL
    ===================================================== */

    document
        .querySelectorAll(".order-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const card =
                        button.closest(
                            ".product-card"
                        );


                    openProductModal(card);

                }
            );

        });



    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeProductModal() {

        if (!modal) return;


        modal.classList.remove("active");


        document.body.style.overflow =
            "";

    }



    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            closeProductModal
        );

    }



    /* Click outside popup */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {

                    closeProductModal();

                }

            }
        );

    }



    /* ESC key */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeProductModal();

            }

        }
    );



    /* =====================================================
       QUANTITY +
    ===================================================== */

    if (plusBtn) {

        plusBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                quantity++;


                if (qtyText) {

                    qtyText.textContent =
                        quantity;

                }

            }
        );

    }



    /* =====================================================
       QUANTITY -
    ===================================================== */

    if (minusBtn) {

        minusBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                if (quantity > 1) {

                    quantity--;

                }


                if (qtyText) {

                    qtyText.textContent =
                        quantity;

                }

            }
        );

    }



    /* =====================================================
       WHATSAPP ORDER
       + FIRESTORE ORDER SAVE
    ===================================================== */

    if (modalOrderBtn) {

        modalOrderBtn.addEventListener(
            "click",
            async function () {


                const phone =
                await getWhatsAppNumber();


                /* =================================================
                   BANGLE SIZE CHECK
                ================================================= */

                let bangleSize = "";


                if (selectedProduct.isBangle) {

                    if (
                        !sizeSelect ||
                        !sizeSelect.value
                    ) {

                        alert(
                            "Please select your bangle size."
                        );

                        return;

                    }


                    bangleSize =
                        sizeSelect.value;

                }



                /* =================================================
                   ORDER DATA
                ================================================= */

                const orderData = {

                    productName:
                        selectedProduct.name,

                    price:
                        selectedProduct.price,

                    quantity:
                        quantity,

                    bangleSize:
                        bangleSize,

                    image:
                        selectedProduct.image,

                    status:
                        "New",

                    createdAt:
                        new Date().toISOString()

                };



                /* =================================================
                   SAVE ORDER TO FIRESTORE
                ================================================= */

                try {

                    const { db } =
                        await import(
                            "./firebase-config.js"
                        );


                    const {
                        collection,
                        addDoc
                    } =
                        await import(
                            "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
                        );


                    await addDoc(
                        collection(
                            db,
                            "orders"
                        ),
                        orderData
                    );


                    console.log(
                        "Order saved successfully:",
                        orderData
                    );

                }

                catch (error) {

                    console.error(
                        "Order save failed:",
                        error
                    );

                }



                /* =================================================
                   WHATSAPP MESSAGE
                ================================================= */

                let message =

                    "Hello MJ WORKS! 👋\n\n" +

                    "I would like to order:\n\n" +

                    "Product: " +

                    selectedProduct.name +

                    "\n" +

                    "Price: " +

                    selectedProduct.price +

                    "\n" +

                    "Quantity: " +

                    quantity;



                /* =================================================
                   BANGLE SIZE
                ================================================= */

                if (selectedProduct.isBangle) {

                    message +=

                        "\nBangle Size: " +

                        bangleSize;

                }



                message +=

                    "\n\nThank you! ❤️";



                /* =================================================
                   OPEN WHATSAPP
                ================================================= */

                const url =

                    "https://wa.me/" +

                    phone +

                    "?text=" +

                    encodeURIComponent(
                        message
                    );


                window.open(
                    url,
                    "_blank"
                );

            }
        );

    }



    /* =====================================================
       OLD INLINE ORDER FUNCTION
    ===================================================== */

    window.orderProduct =
        async function (
            productName,
            price
        ) {

            const phone =
            await getWhatsAppNumber();


            const message =

                "Hello MJ WORKS! 👋\n\n" +

                "I would like to order:\n\n" +

                "Product: " +

                productName +

                "\n" +

                "Price: " +

                price +

                "\n\nThank you! ❤️";


            const url =

                "https://wa.me/" +

                phone +

                "?text=" +

                encodeURIComponent(
                    message
                );


            window.open(
                url,
                "_blank"
            );

        };



    /* =====================================================
       REVIEW BOOK
    ===================================================== */

    const reviewBook =
        document.getElementById(
            "reviewBook"
        );

    const reviewPrev =
        document.getElementById(
            "reviewPrev"
        );

    const reviewNext =
        document.getElementById(
            "reviewNext"
        );



    if (
        reviewBook &&
        reviewPrev &&
        reviewNext
    ) {

        let reviewIndex = 0;


        const pages =
            reviewBook.querySelectorAll(
                ".review-page"
            );


        function updateReview() {

            if (!pages.length) return;


            const width =
                pages[0].offsetWidth;


            reviewBook.scrollTo({

                left:
                    reviewIndex * width,

                behavior:
                    "smooth"

            });

        }



        reviewNext.addEventListener(
            "click",
            function () {

                if (
                    reviewIndex <
                    pages.length - 1
                ) {

                    reviewIndex++;

                    updateReview();

                }

            }
        );



        reviewPrev.addEventListener(
            "click",
            function () {

                if (
                    reviewIndex > 0
                ) {

                    reviewIndex--;

                    updateReview();

                }

            }
        );



        /* Touch swipe */

        let startX = 0;


        reviewBook.addEventListener(
            "touchstart",
            function (event) {

                startX =
                    event.touches[0].clientX;

            },
            {
                passive: true
            }
        );


        reviewBook.addEventListener(
            "touchend",
            function (event) {

                const endX =
                    event.changedTouches[0].clientX;


                const difference =
                    startX - endX;


                if (
                    Math.abs(difference) < 50
                ) {

                    return;

                }


                if (difference > 0) {

                    if (
                        reviewIndex <
                        pages.length - 1
                    ) {

                        reviewIndex++;

                    }

                }

                else {

                    if (
                        reviewIndex > 0
                    ) {

                        reviewIndex--;

                    }

                }


                updateReview();

            },
            {
                passive: true
            }
        );

    }



    /* =====================================================
       CUSTOMER REVIEW FORM
    ===================================================== */

    const reviewForm =
        document.getElementById(
            "reviewForm"
        );

    const reviewName =
        document.getElementById(
            "reviewName"
        );

    const reviewText =
        document.getElementById(
            "reviewText"
        );

    const reviewImage =
        document.getElementById(
            "reviewImage"
        );



    if (reviewForm) {

        reviewForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    reviewName.value.trim();


                const text =
                    reviewText.value.trim();


                const file =
                    reviewImage.files[0];


                if (
                    !name ||
                    !text ||
                    !file
                ) {

                    alert(
                        "Please fill all fields and upload an image."
                    );

                    return;

                }



                const reader =
                    new FileReader();



                reader.onload =
                    function (e) {


                        const review = {

                            name:
                                name,

                            text:
                                text,

                            image:
                                e.target.result,

                            date:
                                new Date()
                                    .toLocaleDateString()

                        };



                        let reviews = [];


                        try {

                            reviews =
                                JSON.parse(
                                    localStorage.getItem(
                                        "mjWorksReviews"
                                    )
                                ) || [];

                        }

                        catch (error) {

                            reviews = [];

                        }



                        reviews.unshift(
                            review
                        );



                        localStorage.setItem(
                            "mjWorksReviews",
                            JSON.stringify(
                                reviews
                            )
                        );



                        reviewForm.reset();



                        alert(
                            "Review added successfully ❤️"
                        );

                    };



                reader.readAsDataURL(
                    file
                );

            }
        );

    }



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );

    const navbar =
        document.querySelector(
            ".navbar"
        );



    if (
        menuBtn &&
        navbar
    ) {

        menuBtn.addEventListener(
            "click",
            function () {

                navbar.classList.toggle(
                    "show"
                );

            }
        );



        navbar
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navbar.classList.remove(
                            "show"
                        );

                    }
                );

            });

    }



    /* =====================================================
       FINISHED
    ===================================================== */

    console.log(
        "MJ WORKS - ALL FEATURES READY ❤️"
    );

});



/* =========================================================
   CUSTOM ORDER
========================================================= */

async function customOrder() {

    const message =
        encodeURIComponent(
            "Hello MJ WORKS! I would like to place a custom order."
        );


    window.open(

        "https://wa.me/" +
        await getWhatsAppNumber() +
        "?text=" +
        message,

        "_blank"

    );

}