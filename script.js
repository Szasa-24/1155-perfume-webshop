const productsData = [
    { 
        id: '1155-szasa', 
        name: "Szása Kölni", 
        price: 28990, 
        image: "images/szasa-kolni.png", 
        desc: "A tavasz legfrissebb illatjegyei, egy nagyon kifinomult, dicséretet vonzó illat. Nem fojtogató, tökéletes társ a melegebb napokon is. Ha ki akarsz tűnni a designer parfümök felhőjéből." 
    },
    { 
        id: '1155-oldmoney', 
        name: "Old Money", 
        price: 34990, 
        image: "images/old-money.png", 
        desc: "A diszkrét luxus és a megkérdőjelezhetetlen státusz illata. Klasszikus, időtlen kompozíció, amely fás és fűszeres jegyeivel tiszteletet parancsol anélkül, hogy hivalkodó lenne." 
    },
    { 
        id: '1155-nofilter', 
        name: "No Filter", 
        price: 29990, 
        image: "images/no-filter.png", 
        desc: "Nyers, őszinte és erőteljes. Nincsenek felesleges kompromisszumok, csak a színtiszta, határozott karakter. Ideális azoknak, akik a tettekben hisznek a szavak helyett." 
    },
    { 
        id: '1155-seduction', 
        name: "Seduction", 
        price: 36990, 
        image: "images/seduction.png", 
        desc: "Mély, sötét, orientális illat, amely rabul ejt. A tökéletes fegyver az esti órákra. Füstös, édeskés jegyei garantálják, hogy a jelenléted emlékezetes marad." 
    },
    { 
        id: '1155-jelenlet', 
        name: "Jelenlét", 
        price: 32990, 
        image: "images/jelenlet.png", 
        desc: "A fókuszált elme és a stabil alapok illata. Kifejezetten olyan napokra alkotva, amikor maximális teljesítményt kell nyújtanod. Elegáns, friss nyitás, amely stabil, férfias alapokba szárad le." 
    }
];

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('1155_cart')) || [];
        this.init();
    }

    init() {
        this.updateDOM();
    }

    save() {
        localStorage.setItem('1155_cart', JSON.stringify(this.items));
        this.updateDOM();
    }

    add(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
        uiManager.showToast(`${product.name} a kosárba helyezve!`);
    }

    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    }

    toggle() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        if(sidebar.classList.contains('active')) {
            uiManager.closeModal();
        }
    }

    checkout() {
        if(this.items.length === 0) {
            uiManager.showToast("A kosarad jelenleg üres.");
            return;
        }
        alert("Átirányítás a biztonságos fizetési oldalra... (Backend integráció szükséges)");
    }

    updateDOM() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-badge').innerText = totalItems;

        const container = document.getElementById('cart-items-container');
        container.innerHTML = '';
        let totalPrice = 0;

        this.items.forEach(item => {
            totalPrice += (item.price * item.quantity);
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${item.quantity} x ${item.price.toLocaleString('hu-HU')} Ft</p>
                    <button class="remove-item" onclick="cartSystem.remove('${item.id}')">Eltávolítás</button>
                </div>
            `;
            container.appendChild(div);
        });

        document.getElementById('cart-total-price').innerText = totalPrice.toLocaleString('hu-HU') + ' Ft';
    }
}

class UIManager {
    constructor(products) {
        this.products = products;
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        this.products.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => this.openModal(prod.id);
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${prod.image}" alt="${prod.name}">
                </div>
                <div class="product-info">
                    <div>
                        <div class="product-category">Extrait de Parfum</div>
                        <h3 class="product-title">${prod.name}</h3>
                        <p class="product-price">${prod.price.toLocaleString('hu-HU')} Ft</p>
                    </div>
                    <button class="btn btn-outline btn-full">Részletek</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    openModal(id) {
        const prod = this.products.find(p => p.id === id);
        if(!prod) return;

        document.getElementById('modal-img').src = prod.image;
        document.getElementById('modal-name').innerText = prod.name;
        document.getElementById('modal-price').innerText = prod.price.toLocaleString('hu-HU') + ' Ft';
        document.getElementById('modal-desc').innerText = prod.desc;
        
        const addBtn = document.getElementById('modal-add-btn');
        addBtn.onclick = () => {
            cartSystem.add(prod);
            this.closeModal();
            setTimeout(() => cartSystem.toggle(), 300);
        };

        document.getElementById('product-modal').classList.add('active');
        document.getElementById('product-modal-overlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('product-modal').classList.remove('active');
        document.getElementById('product-modal-overlay').classList.remove('active');
    }

    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        
        container.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    removePreloader() {
        const preloader = document.getElementById('preloader');
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 1000);
    }
}

const cartSystem = new Cart();
const uiManager = new UIManager(productsData);

window.onload = () => {
    uiManager.renderProducts();
    uiManager.removePreloader();
};

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});