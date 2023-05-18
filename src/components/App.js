import { useState, useEffect } from 'react';
import api from "../utils/Api"
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";


function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then((result) => {
        const [userData, cardsData] = result;
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => console.log(err));
    }, []);


  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
  }



  function handleCardLike(card) {
      // Снова проверяем, есть ли уже лайк на этой карточке
      const isLiked = card.likes.some(i => i._id === currentUser._id);
      
      // Отправляем запрос в API и получаем обновлённые данные карточки
      api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => console.log(err));
  };

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards => cards.filter((c) => c._id !== card._id))
      })
      .catch((err) => console.log(err));
    };

  function handleUpdateUser(data) {
    console.log(data);
    api.setUserInfo({data})
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
        .catch((err) => console.log(err));
    };

    function handleUpdateAvatar({avatar}) {
      console.log(avatar);
      api.setUserAvatar(avatar)
        .then((newUser) => {
          setCurrentUser(newUser);
          closeAllPopups();
        })
        .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit({ name, link }) {
      api.addNewCard(name, link)
        .then(newCard => {
          setCards([newCard, ...cards]);
          closeAllPopups();
        })
        .catch((err) => console.log(err));
    }

  return (
  <CurrentUserContext.Provider value={currentUser}>
    <div className="page">
      <Header />
      <Main
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        cards={cards}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
      />
      <Footer />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <EditAvatarPopup
      isOpen={isEditAvatarPopupOpen}
      onClose={closeAllPopups}
      onUpdateAvatar={handleUpdateAvatar}
      /> 

      <PopupWithForm
        name="delete"
        title="Вы уверены?"
        textButton="Да"
        onClose={closeAllPopups}
      ></PopupWithForm>

      <ImagePopup
        card={selectedCard}
        onClose={closeAllPopups}
        />
    </div>
  </CurrentUserContext.Provider>
)}

export default App;