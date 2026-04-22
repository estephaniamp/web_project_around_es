import { Card } from "./components/Card.js";
import { FormValidator } from "./components/FormValidator.js";
import { Section } from "./components/Section.js";
import { PopupWithImage } from "./components/PopupWithImage.js";
import { PopupWithForm } from "./components/PopupWithForm.js";
import { PopupWithConfirmation } from "./components/PopupWithConfirmation.js";
import { UserInfo } from "./components/UserInfo.js";
import { Api } from "./components/Api.js";

const api = new Api({
  baseUrl: "https://around-api.es.tripleten-services.com/v1",
  headers: {
    authorization: "49fcb6ae-832d-4765-bbfa-4092ca2625ec",
    "Content-Type": "application/json",
  },
});

let userId;

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

const imagePopup = new PopupWithImage(".popup_type_image");
imagePopup.setEventListeners();

const popupEditProfile = new PopupWithForm(
  ".popup_type_edit-profile",
  handleEditProfileSubmit,
);

popupEditProfile.setEventListeners();

const popupAddCard = new PopupWithForm(
  ".popup_type_new-card",
  handleAddCardSubmit,
);

popupAddCard.setEventListeners();

const popupAvatar = new PopupWithForm(".popup_type_avatar", handleAvatarSubmit);

popupAvatar.setEventListeners();

const confirmationPopup = new PopupWithConfirmation(".popup_type_delete");

confirmationPopup.setEventListeners();

const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const avatarButton = document.querySelector(".profile__image-container");

const nameInput = document.querySelector("#profile-name");
const jobInput = document.querySelector("#profile-description");

function createCard(item) {
  const card = new Card(
    item,
    userId,
    "#card-template",
    handleImageClick,
    handleDeleteClick,
    handleLikeClick,
  );

  return card.generateCard();
}

const cardSection = new Section(
  {
    renderer: (item) => {
      cardSection.addItem(createCard(item));
    },
  },
  ".cards__list",
);

function handleImageClick(name, link) {
  imagePopup.open(name, link);
}

function handleLikeClick(card) {
  const isLiked = card.isLiked();

  const request = isLiked
    ? api.removeLike(card.getId())
    : api.addLike(card.getId());

  request
    .then((updatedCard) => {
      card.updateLikes(updatedCard);
    })
    .catch((err) => console.log(err));
}

function handleDeleteClick(card) {
  confirmationPopup.open();

  confirmationPopup.setSubmitAction(() => {
    api
      .deleteCard(card.getId())
      .then(() => {
        card.removeCard();
        confirmationPopup.close();
      })
      .catch((err) => console.log(err));
  });
}

function handleEditProfileSubmit({ name, description }) {
  popupEditProfile.renderLoading(true);

  api
    .updateUserInfo(name, description)
    .then((data) => {
      userInfo.setUserInfo({
        name: data.name,
        job: data.about,
        avatar: data.avatar,
      });
      popupEditProfile.close();
    })
    .catch((err) => console.log(err))
    .finally(() => popupEditProfile.renderLoading(false));
}

function handleAddCardSubmit({ title, link }) {
  popupAddCard.renderLoading(true);

  api
    .addCard(title, link)
    .then((newCard) => {
      cardSection.addItem(createCard(newCard));
      popupAddCard.close();
    })
    .catch((err) => console.log(err))
    .finally(() => popupAddCard.renderLoading(false));
}

function handleAvatarSubmit({ avatar }) {
  popupAvatar.renderLoading(true);

  api
    .updateAvatar(avatar)
    .then((data) => {
      userInfo.setUserInfo({
        name: data.name,
        job: data.about,
        avatar: data.avatar,
      });
      popupAvatar.close();
    })
    .catch((err) => console.log(err))
    .finally(() => popupAvatar.renderLoading(false));
}

editProfileButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();

  nameInput.value = userData.name;
  jobInput.value = userData.job;

  formValidators["edit-profile-form"].resetValidation();

  popupEditProfile.open();
});

addCardButton.addEventListener("click", () => {
  formValidators["add-card-form"].resetValidation();
  popupAddCard.open();
});

avatarButton.addEventListener("click", () => {
  formValidators["avatar-form"].resetValidation();
  popupAvatar.open();
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

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;

    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
      avatar: userData.avatar,
    });

    cardSection.renderItems(cards);
  })
  .catch((err) => console.log(err));
