document.addEventListener('DOMContentLoaded', function() {

    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const cart = document.querySelector('.cart');



/////////////////////////////////////
    const links = document.querySelectorAll('a');
    function stopdef(e) {
        e.preventDefault();
    }
    for (let link of links) {
        link.addEventListener('click', stopdef, false);
    }
/////////////////////////////////////



    const goodsWrapper = document.querySelector('.goods-wrapper');

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3'
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="./img/temp/${img}" alt="">
                                <button class="card-add-wishlist"
                                data-goods-id="${id}"></button>
                            </div>
                            <div class="card-body justify-content-between">
                                <a href="#" class="card-title">${title}</a>
                                <div class="card-price">${price} ₽</div>
                                <div>
                                    <button class="card-add-cart"
                                    data-goods-id="${id}">Добавить в корзину</button>
                                </div>
                            </div>
                        </div>`
        return card;
    }

    goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, 'Archer.jpg'));
    goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 3000, 'Flamingo.jpg'));
    goodsWrapper.appendChild(createCardGoods(3, 'Носки', 4000, 'Socks.jpg'));

    const closeCart = (event) => {
        const target = event.target;

        if (target === cart || target.classList.contains('cart-close')) {
            cart.style.display = "none";
        }
    }

    const openCart = () => {
        cart.style.display = "flex";
    }

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);

    //////////////////////////////////////////////
    document.addEventListener('keydown', function(event) { 
        if (event.code == 'Escape') {
            cart.style.display = "none";
        }
    });
    ///////////////////////////////////////////////////

})