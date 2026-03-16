import { Card } from "../components/Card.js";
import { FormValidator } from "../components/FormValidator.js";
import { Section } from "../components/Section.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import { UserInfo } from "../components/UserInfo.js";

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

const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

const nameInput = document.querySelector("#profile-name");
const jobInput = document.querySelector("#profile-description");

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

const imagePopup = new PopupWithImage(".popup_type_image");
imagePopup.setEventListeners();

function createCard(item) {
  const card = new Card(item, "#card-template", (name, link) => {
    imagePopup.open(name, link);
  });

  return card.generateCard();
}

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list",
);

cardSection.renderItems();

const editProfilePopup = new PopupWithForm(
  ".popup_type_edit-profile",
  (data) => {
    userInfo.setUserInfo({
      name: data.name,
      job: data.description,
    });

    editProfilePopup.close();
  },
);

editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm(".popup_type_new-card", (data) => {
  const cardElement = createCard({
    name: data.title,
    link: data.link,
  });

  cardSection.addItem(cardElement);

  document.querySelector("#add-card-form").reset();

  addCardPopup.close();
});

addCardPopup.setEventListeners();

editProfileButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();

  nameInput.value = userData.name;
  jobInput.value = userData.job;

  formValidators["edit-profile-form"].resetValidation();

  editProfilePopup.open();
});

addCardButton.addEventListener("click", () => {
  formValidators["add-card-form"].resetValidation();

  addCardPopup.open();
});

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "form__input-error_active",
};

const formList = Array.from(
  document.querySelectorAll(validationConfig.formSelector),
);

const formValidators = {};

formList.forEach((formElement) => {
  const validator = new FormValidator(validationConfig, formElement);
  const formName = formElement.getAttribute("id");

  formValidators[formName] = validator;

  validator.enableValidation();
});
