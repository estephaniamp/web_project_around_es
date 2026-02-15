const initialCards = [
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg",
  },
  {
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg",
  },
];

const cardsContainer = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

const profileEditButton = document.querySelector(".profile__edit-button");
const editProfilePopup = document.querySelector("#edit-popup");
const closeEditProfileButton = editProfilePopup.querySelector(".popup__close");

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editProfileForm = document.querySelector("#edit-profile-form");
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const descriptionInput = editProfileForm.querySelector(
  ".popup__input_type_description",
);

const addCardButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector("#add-popup");
const closeAddCardButton = addCardPopup.querySelector(".popup__close");
const addCardForm = document.querySelector("#add-card-form");
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardForm.querySelector(".popup__input_type_url");

const imagePopup = document.querySelector("#image-popup");
const imagePopupPicture = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");
const closeImagePopupButton = imagePopup.querySelector(".popup__close");

function openPopup(popupElement) {
  popupElement.classList.add("popup_opened");
  document.addEventListener("keydown", handleEscClose);
}

function closePopup(popupElement) {
  popupElement.classList.remove("popup_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_opened");
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("popup_opened")) {
    closePopup(evt.target);
  }
}

function fillProfileForm() {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
}

function handleEditProfileClick() {
  fillProfileForm();
  resetValidation(editProfileForm, validationConfig);
  openPopup(editProfilePopup);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closePopup(editProfilePopup);
}

function getCardElement(name, link) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    imagePopupPicture.src = link;
    imagePopupPicture.alt = name;
    imagePopupCaption.textContent = name;
    openPopup(imagePopup);
  });

  return cardElement;
}

function renderCard(name, link) {
  const cardElement = getCardElement(name, link);
  cardsContainer.prepend(cardElement);
}

function handleAddCardClick() {
  resetValidation(addCardForm, validationConfig);
  openPopup(addCardPopup);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderCard(cardNameInput.value, cardLinkInput.value);
  addCardForm.reset();
  closePopup(addCardPopup);
}

const popupList = document.querySelectorAll(".popup");
popupList.forEach((popup) => {
  popup.addEventListener("mousedown", handleOverlayClick);
});

profileEditButton.addEventListener("click", handleEditProfileClick);
closeEditProfileButton.addEventListener("click", () =>
  closePopup(editProfilePopup),
);
editProfileForm.addEventListener("submit", handleProfileFormSubmit);

addCardButton.addEventListener("click", handleAddCardClick);
closeAddCardButton.addEventListener("click", () => closePopup(addCardPopup));
addCardForm.addEventListener("submit", handleCardFormSubmit);

closeImagePopupButton.addEventListener("click", () => closePopup(imagePopup));

initialCards.forEach((card) => {
  renderCard(card.name, card.link);
});
