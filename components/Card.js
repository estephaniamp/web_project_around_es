export class Card {
  constructor(
    data,
    userId,
    templateSelector,
    handleImageClick,
    handleDeleteClick,
    handleLikeClick,
  ) {
    this._data = data;
    this._name = data.name;
    this._link = data.link;

    this._likes = data.likes || [];
    this._isLiked = data.isLiked || false;

    this._ownerId =
      typeof data.owner === "object" ? data.owner._id : data.owner;

    this._cardId = data._id;
    this._userId = userId;

    this._templateSelector = templateSelector;

    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
  }

  _getTemplate() {
    return document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  getId() {
    return this._cardId;
  }

  isLiked() {
    if (this._likes.length > 0) {
      return this._likes.some((user) =>
        typeof user === "object"
          ? user._id === this._userId
          : user === this._userId,
      );
    }

    return this._isLiked;
  }

  updateLikes(data) {
    this._likes = data.likes || [];
    this._isLiked = data.isLiked || false;

    if (this.isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  removeCard() {
    this._element.remove();
    this._element = null;
  }

  _checkDeletePermission() {
    if (this._ownerId !== this._userId) {
      this._deleteButton.remove();
    }
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this);
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this);
    });

    this._image.addEventListener("click", () => {
      this._handleImageClick(this._name, this._link);
    });
  }

  generateCard() {
    this._element = this._getTemplate();

    this._image = this._element.querySelector(".card__image");
    this._title = this._element.querySelector(".card__title");
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");

    this._title.textContent = this._name;
    this._image.src = this._link;
    this._image.alt = this._name;

    this._checkDeletePermission();

    this._setEventListeners();

    return this._element;
  }
}
