/// Забираем API карточек и отрисовывем их

const goodsContainer = document.querySelector(".goods__container");
const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__button");
const goodsSearch = document.querySelector(".goods__user-search-container");
const basket = document.querySelector(".header__basket");

let cardsList = [];
let visibleCardsList = [];
const pickedItems = [];

const showActivityIndicator = () => {
  const activityIndicator = document.createElement("div");
  activityIndicator.classList.add("lds-roller");
  for (let index = 0; index < 7; index++) {
    activityIndicator.append(document.createElement("div"));
  }
  goodsContainer.append(activityIndicator);
};

const showUserSearch = (inputValue) => {
  goodsSearch.innerHTML = "";
  if (!inputValue) {
    return;
  }
  const currentSearch = document.createElement("p");
  currentSearch.innerHTML = inputValue;
  currentSearch.classList.add("goods__user-search");

  const buttonRemove = document.createElement("button");
  buttonRemove.classList.add("goods__reset-search");
  buttonRemove.innerText = "X";
  buttonRemove.setAttribute("onclick", `clearSearchInput()`);
  goodsSearch.append(currentSearch);
  goodsSearch.append(buttonRemove);
};

const clearSearchInput = () => {
  goodsSearch.innerHTML = "";
  searchInput.value = "";
  renderCards(cardsList);
};

const requestCards = async () => {
  showActivityIndicator();
  fetch("https://620c056eb57363259384e758.mockapi.io/Cards")
    .then((response) => response.json())
    .then((data) => {
      cardsList = data;
      renderCards(cardsList);
    });
};

const renderCards = (data) => {
  goodsContainer.innerHTML = "";
  data.forEach(({ price, priceBefore, discount, brand, picture, id }) => {
    const goodsItem = document.createElement("div");
    goodsItem.classList.add("goods__item");
    goodsItem.setAttribute("id", id);

    const itemPic = document.createElement("img");
    itemPic.classList.add("item__pic");
    itemPic.setAttribute("src", picture);
    goodsItem.append(itemPic);

    const itemNames = document.createElement("div");
    itemNames.classList.add("item__name");
    goodsItem.append(itemNames);

    const itemTitle = document.createElement("div");
    itemTitle.classList.add("item__preview");
    itemTitle.innerText = "Быстрый доступ";
    itemTitle.setAttribute("onclick", `showCard ('${picture}')`);
    itemNames.append(itemTitle);

    const itemDiscount = document.createElement("p");
    itemDiscount.classList.add("item__discount");
    itemDiscount.innerText = "-" + discount + "%";
    goodsItem.append(itemDiscount);

    const addToBasket = document.createElement("button");
    addToBasket.classList.add("item__basket");
    addToBasket.setAttribute("onclick", `addToBasket(${id})`);
    goodsItem.append(addToBasket);

    const itemInfo = document.createElement("div");
    itemInfo.classList.add("item__info");
    goodsItem.append(itemInfo);

    const infoPriceNow = document.createElement("p");
    infoPriceNow.classList.add("info__price--now");
    infoPriceNow.innerText = price;
    itemInfo.append(infoPriceNow);

    const infoPriceBefore = document.createElement("p");
    infoPriceBefore.classList.add("info__price--before");
    infoPriceBefore.innerText = priceBefore + "Br";
    itemInfo.append(infoPriceBefore);

    const itemDescription = document.createElement("div");
    itemDescription.classList.add("item__description");
    goodsItem.append(itemDescription);

    const descriptionBrand = document.createElement("p");
    descriptionBrand.classList.add("description__brand");
    descriptionBrand.innerText = brand;
    itemDescription.append(descriptionBrand);

    goodsContainer.append(goodsItem);
  });
};

requestCards();

/// Поиск
searchInput.addEventListener("input", (event) => searchCards(event.target.value, cardsList));

const searchCards = (inputValue, cardsList) => {
  showUserSearch(inputValue);

  if (!inputValue) {
    renderCards(cardsList);
    return;
  }

  visibleCardsList = cardsList.filter((card) => card.brand.toLowerCase().includes(inputValue.toLowerCase()));
  renderCards(visibleCardsList);
};

//увеличение картинки

const showCard = (pictureSrc) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.setAttribute("id", "image");

  const popupBody = document.createElement("div");
  popupBody.classList.add("popup__body");
  popup.append(popupBody);

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup__content");
  popupBody.append(popupContent);

  const popupClose = document.createElement("a");
  popupClose.classList.add("popup__close");
  popupClose.setAttribute("href", "#");
  popupClose.setAttribute("onclick", `clearPopup()`);
  popupClose.innerText = "X";
  popupContent.append(popupClose);

  const popupImage = document.createElement("div");
  popupImage.classList.add("popup__image");
  popupContent.append(popupImage);

  const printImage = document.createElement("img");
  printImage.setAttribute("src", pictureSrc);
  printImage.classList.add("print__image");
  popupContent.append(printImage);

  goodsContainer.append(popup);
};

const clearPopup = () => {};

/// корзина

const createItem = (itemName, itemPrice, itemCount) => {
  const item = document.createElement("li");
  item.classList.add("item");

  const name = document.createElement("span");
  name.classList.add("name");
  name.innerText = `${itemName}`;
  item.append(name);

  const price = document.createElement("span");
  price.classList.add("price");
  price.innerText = `${itemPrice}`;
  item.append(price);

  const count = document.createElement("input");
  count.classList.add("count");
  count.setAttribute("type", "number");
  count.setAttribute("min", "0");
  count.setAttribute("value", `${itemCount}`);
  item.append(count);

  return item;
};

const findBasketItem = (cardsList, pickedItems) => {
  return pickedItems.reduce((acc, itemID) => {
    const foundItem = cardsList.find((item) => item.id == itemID);
    if (foundItem) {
      if (!foundItem.count) {
        foundItem.count = 1;
      }
      if (acc.find((item) => item.id === foundItem.id)) {
        foundItem.count = foundItem.count + 1;
        return acc;
      }
      acc.push(foundItem);
    }
    return acc;
  }, []);
};

const calcBasketItem = (currentBasketItems) => {
  return currentBasketItems.reduce((sum, item) => +item.price * item.count + sum, 0);
};

const clearBasket = (pickedItems) => {
  pickedItems.length = 0;
};

const renderBasket = (cardsList, pickedItems) => {
  const currentBasketItems = findBasketItem(cardsList, pickedItems);
  console.log("currentBasketItems: ", currentBasketItems);

  const basket = document.createElement("div");
  basket.classList.add("basket");

  const basketContainer = document.createElement("div");
  console.log("basketContainer: ", basketContainer);
  basketContainer.classList.add("basket__container");
  basket.append(basketContainer);

  const basketHeader = document.createElement("div");
  basketHeader.classList.add("basket__header");
  basketContainer.append(basketHeader);

  const basketTitle = document.createElement("div");
  basketTitle.classList.add("basket__title");
  basketHeader.append(basketTitle);

  const title = document.createElement("p");
  title.classList.add("title");
  title.innerText = "Корзина";
  basketTitle.append(title);

  const basketButton = document.createElement("div");
  basketButton.classList.add("basket__button");
  basketHeader.append(basketTitle);

  const clearItems = document.createElement("button");
  clearItems.classList.add("clear__items");
  clearItems.innerText = "Очистить корзину";
  clearItems.setAttribute("onclick", "clearBasket(pickedItems)");
  basketHeader.append(clearItems);

  const itemsList = document.createElement("ul");
  itemsList.classList.add("items__list");
  basketContainer.append(itemsList);
  //цикл
  //  const createItem = (pickedItems) =>{

  //  }
  currentBasketItems.forEach((item) => {
    itemsList.append(createItem(item.brand, item.price, item.count)); //<-
  });

  const sum = document.createElement("div");
  sum.classList.add("sum");

  const total = document.createElement("span");
  total.classList.add("total");
  total.innerText = "Итого:";
  sum.append(total);

  const totalSum = document.createElement("span");
  totalSum.classList.add("total__sum");
  totalSum.innerText = `${calcBasketItem(currentBasketItems)} Br`;
  sum.append(totalSum);

  basketContainer.append(sum);
  goodsContainer.append(basket);
};

const addToBasket = (id) => {
  pickedItems.push(id);
};

basket.addEventListener("click", () => renderBasket(cardsList, pickedItems));
