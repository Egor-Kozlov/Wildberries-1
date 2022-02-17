 
 /// Забираем API карточек и отрисовывем их
 async function getCards() {
    fetch("https://620c056eb57363259384e758.mockapi.io/Cards")
    .then((response) => response.json())
    .then((data) => printCards(data))
}
getCards()

function printCards(data) {
    const goodsContainer = document.querySelector(".goods__container")
    data.forEach(({price, priceBefore, discount, brand, picture}) => {
        const goodsItem = document.createElement("div");
        goodsItem.classList.add("goods__item");
        goodsContainer.append(goodsItem)
        
        const itemPic = document.createElement("img")
        itemPic.classList.add("item__pic")
        itemPic.setAttribute("src", picture )
        goodsItem.append(itemPic)
        
        const itemNames = document.createElement("div")
        itemNames.classList.add("item__name")
        goodsItem.append(itemNames)
        
        const itemTitle = document.createElement("h3")
        itemTitle.classList.add("item__title")
        itemTitle.innerText = "Быстрый доступ"
        itemNames.append(itemTitle)
        
        const itemDiscount = document.createElement("p")
        itemDiscount.classList.add("item__discount")
        itemDiscount.innerText ="-" + discount + "%" 
        goodsItem.append(itemDiscount)
        
        const itemInfo = document.createElement("div")
        itemInfo.classList.add("item__info")
        goodsItem.append(itemInfo)
        
        const infoPriceNow = document.createElement("p")
        infoPriceNow.classList.add("info__price--now")
        infoPriceNow.innerText = price
        itemInfo.append(infoPriceNow)
        
        const infoPriceBefore = document.createElement("p")
        infoPriceBefore.classList.add("info__price--before")
        infoPriceBefore.innerText = priceBefore + "Br"
        itemInfo.append(infoPriceBefore)
        
        const itemDescription = document.createElement("div")
        itemDescription.classList.add("item__description")
        goodsItem.append(itemDescription)
        
        const descriptionBrand = document.createElement("p")
        descriptionBrand.classList.add("description__brand")
        descriptionBrand.innerText = brand
        itemDescription.append(descriptionBrand)      
    });
}


/// Поиск

const searchInput = document.querySelector('.search__input')
const card = document.querySelector('.goods__item')
const searchButton = document.querySelector('.search__button')

let storage = [ ]

searchInput.addEventListener('input', (event) => {
    let newCards = []
    let targetElement = (event.target.value);
    console.log(targetElement);
    newCards = storage.filter(el => el.brand.includes(targetElement))
    clear();
    printCards(data)
})
console.log(storage);




function clear() {
    card.innerHTML =""
}


