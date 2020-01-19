document.addEventListener('DOMContentLoaded', function() {

    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const wishCounter = wishlistBtn.querySelector('.counter');
    const cartCounter = cartBtn.querySelector('.counter');
    const cartWrapper = document.querySelector('.cart-wrapper');

    const wishlist = [];
    let goodsBasket = {};

/////////////////////////////////////
    const links = document.querySelectorAll('a');
    function stopdef(e) {
        e.preventDefault();
    }
    for (let link of links) {
        link.addEventListener('click', stopdef, false);
    }
/////////////////////////////////////


    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3'
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist ${wishlist.includes(id)? 'active' : ''}"
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
    const createCardGoodsBasket = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'goods'
        card.innerHTML =    `<div class="goods-img-wrapper">
                                <img class="goods-img" src="${img}" alt="">
                            </div>
                            <div class="goods-description">
                                <h2 class="goods-title">${title}</h2>
                                <p class="goods-price">${price} ₽</p>

                            </div>
                            <div class="goods-price-count">
                                <div class="goods-trigger">
                                    <button class="goods-add-wishlist ${wishlist.includes(id)? 'active' : ''}" 
                                    data-goods-id="${id}"></button>
                                    <button class="goods-delete" 
                                    data-goods-id="${id}"></button>
                                </div>
                                <div class="goods-count">${goodsBasket[id]}</div>
                            </div>`
        return card;
    }

    const closeCart = (event) => {
        const target = event.target;

        if (target === cart || 
            target.classList.contains('cart-close') || 
            event.code == 'Escape') {
            cart.style.display = "none";
            document.removeEventListener('keydown', closeCart);
        }

    }
    const calcTotalPrive = goods => {
        let sum = 0;
        for (const item of goods) {
            sum += item.price * goodsBasket[item.id];
        }
        cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
    }

    const cartBasketFilter = goods => {
        const filteredlist = goods.filter(item => goodsBasket.hasOwnProperty(item.id));
        calcTotalPrive(filteredlist); 
        return filteredlist;
    }
    const openCart = () => {
        cart.style.display = "flex";
        document.addEventListener('keydown', closeCart);
        getGoods(renderCardBasket, cartBasketFilter);
    }

    const renderCard = (items) => {
        goodsWrapper.textContent = '';

        if (items.length) {
            items.forEach(({id, title, price, imgMin}) => {
                goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
            });
        } else {
            goodsWrapper.textContent = '❌ По вашему запросу ничего не найдено';
        }
    }
    const renderCardBasket = (items) => {
        cartWrapper.textContent = '';

        if (items.length) {
            items.forEach(({id, title, price, imgMin}) => {
                cartWrapper.appendChild(createCardGoodsBasket(id, title, price, imgMin));
            });
        } else {
            cartWrapper.innerHTML = `
            <div id="cart-empty">
                Ваша корзина пока пуста
            </div>`;
        }
    }

    const randomSort = (items) => {
        return items.sort(() => Math.random() - 0.5);
    }

    const getGoods = (handler, filter) => {
        loading(handler.name);
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };

    const loading = (functionName) => {
        const spinner = `<div class="loadingio-spinner-wedges-nzma0ocng7"><div class="ldio-0uvgngiifll">
        <div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
        </div></div>`
        if (functionName==='renderCard') {
            goodsWrapper.innerHTML = spinner;
        } else {
            cartWrapper.innerHTML = spinner;
        }
    }

    const searchfunction = event => {
        event.preventDefault();
        const input = event.target.elements.searchGoods.value.trim();
        if (input !== '') {
            const searchString = new RegExp(input, 'i')
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout( () => {
                search.classList.remove('error');
            }, 2000)
        }
    }

    const choiceCategory = event => {
        const target = event.target;

        if (target.classList.contains('category-item')) {
            const category = target.dataset.category;
            getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
        }
    }

    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    const cookieQuery = isGet => {
        if (isGet) {
            if (getCookie('goodsBasket')) {
                Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
            checkCount();
            }
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`;
        }
    }

    const checkCount = () => {
        wishCounter.textContent = wishlist.length;
        cartCounter.textContent = Object.keys(goodsBasket).length;
    }

    const storageQuery = isGet => {
        if (isGet) {
            if (localStorage.getItem('wishlist')) {
                wishlist.splice(0,0, ...JSON.parse(localStorage.getItem('wishlist')));
                checkCount();
            }
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }

    const toggleWishlist = (id, elem) => {
        if (wishlist.includes(id)) {
            wishlist.splice(wishlist.indexOf(id), 1);
            elem.classList.remove('active');
        } else {
            wishlist.push(id);
            elem.classList.add('active');
        }
        checkCount();
        storageQuery(false);
    }
    storageQuery(true);

    const addBasket = id => {
        if (goodsBasket[id]) {
            goodsBasket[id] +=1;
        } else {
            goodsBasket[id] = 1;
        }
        checkCount();
        cookieQuery(false);
    }
    const removeGoods = (id) => {
        delete goodsBasket[id];
        checkCount();
        cookieQuery();
        getGoods(renderCardBasket, cartBasketFilter);
    }
    const handlerBasket = () => {
        const target = event.target;
        console.log('1');

        if (target.classList.contains('goods-add-wishlist')) {
            toggleWishlist(target.dataset.goodsId, target);
        }
        if (target.classList.contains('goods-delete')) {
            removeGoods(target.dataset.goodsId);
        }
    }
    const wishHandler = event => {
        const target = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            toggleWishlist(target.dataset.goodsId, target);
        }

        if (target.classList.contains('card-add-cart')) {
            addBasket(target.dataset.goodsId);
        }
    }

    const showWishlist = () => {
        getGoods(renderCard, goods => goods.filter( item => wishlist.includes(item.id)))
    }

    getGoods(renderCard, randomSort);

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchfunction);
    goodsWrapper.addEventListener('click', wishHandler);
    wishlistBtn.addEventListener('click', showWishlist);
    cartWrapper.addEventListener('click', handlerBasket);
    cookieQuery(true);
})