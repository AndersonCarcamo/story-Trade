import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import defaultImage from '../assets/default_image.jpg';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const fetchImage = async (imageName) => {
  try {
    const response = await fetch(`https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/get?fileName=images/${imageName}`);
    if (response.ok) {
      const base64Data = await response.text();
      return `data:${response.headers.get('content-type')};base64,${base64Data}`;
    } else {
      return defaultImage;
    }
  } catch (error) {
    console.error(`Failed to fetch image ${imageName}: `, error);
    return defaultImage;
  }
};

const fetchUserAvatar = async (avatarName) => {
  try {
    const response = await fetch(`https://opqwurrut9.execute-api.us-east-2.amazonaws.com/dev/get?fileName=avatars/${avatarName}`);
    if (response.ok) {
      const base64Data = await response.text();
      return `data:${response.headers.get('content-type')};base64,${base64Data}`;
    } else {
      return defaultImage;
    }
  } catch (error) {
    console.error(`Failed to fetch avatar ${avatarName}: `, error);
    return defaultImage;
  }
};

const likeBook = async (bookId, ownerId) => {
  try {
    const likerId = await AsyncStorage.getItem('userId');
    if (!likerId) {
      console.error('Liker ID is not available in AsyncStorage');
      return;
    }

    const response = await fetch(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/like/${bookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: ownerId,
        liker_id: likerId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Network response was not ok');
    }
    console.log('Libro agregado a favoritos!');
  } catch (error) {
    console.error('Failed to like book: ', error.message);
  }
};

const unlikeBook = async (bookId, ownerId) => {
  try {
    const likerId = await AsyncStorage.getItem('userId');
    if (!likerId) {
      console.error('Liker ID is not available in AsyncStorage');
      return;
    }

    const response = await fetch(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/unlike/${bookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: ownerId,
        liker_id: likerId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Network response was not ok');
    }
    console.log('Like removed!');
  } catch (error) {
    console.error('Failed to unlike book: ', error.message);
  }
};

const checkIfLiked = async (bookId, ownerId) => {
  try {
    const likerId = await AsyncStorage.getItem('userId');
    if (!likerId) {
      console.error('Liker ID is not available in AsyncStorage');
      return false;
    }

    const response = await fetch(`https://dbstorytrada-b5fcff8487d7.herokuapp.com/like/${bookId}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: ownerId,
        liker_id: likerId
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.hasLiked;
    } else {
      console.error('Failed to check if liked: ', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Failed to check if liked: ', error.message);
    return false;
  }
};

const BookDetails = ({ book, goBack }) => {
  const [bookImage, setBookImage] = useState(defaultImage);
  const [userAvatars, setUserAvatars] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [hasLiked, setHasLiked] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserBook, setSelectedUserBook] = useState(null);
  const [visibleUsers, setVisibleUsers] = useState(6);

  const navigation = useNavigation();

  useEffect(() => {
    const loadBookImage = async () => {
      const imageUrl = await fetchImage(book.book_info.image);
      setBookImage(imageUrl);
    };

    const loadUserAvatars = async () => {
      const avatars = {};
      for (const user of book.users) {
        const avatarUrl = await fetchUserAvatar(user.avatar);
        avatars[user.id] = avatarUrl;
      }
      setUserAvatars(avatars);
    };

    const loadVideo = async () => {
      if (book.users.length > 0 && book.users[0].books.length > 0 && book.users[0].books[0].video) {
        const videoUrl = book.users[0].books[0].video;
        setVideoUrl(videoUrl);
      }
    };

    const initializeLikeState = async () => {
      const likerId = await AsyncStorage.getItem('userId');
      setCurrentUser(likerId);
      const likedState = {};
      for (const user of book.users) {
        const liked = await checkIfLiked(book.book_info.id, user.id);
        likedState[user.id] = liked;
      }
      setHasLiked(likedState);
    };

    loadBookImage();
    loadUserAvatars();
    loadVideo();
    initializeLikeState();
  }, [book]);

  const openModal = (userId) => {
    const userBook = book.users.find(u => u.id === userId).books.find(b => b.book_info.id === book.book_info.id);
    setSelectedUserBook(userBook);
    setSelectedUser(userId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
    setSelectedUserBook(null);
  };

  const handleLike = async (userId) => {
    if (hasLiked[userId]) {
      await unlikeBook(book.book_info.id, userId);
    } else {
      await likeBook(book.book_info.id, userId);
    }
    setHasLiked({ ...hasLiked, [userId]: !hasLiked[userId] });
  };

  const loadMoreUsers = () => {
    setVisibleUsers(prevVisibleUsers => prevVisibleUsers + 6);
  };

  const filteredUsers = book.users.filter(user => user.id !== parseInt(currentUser));
  const usersToDisplay = filteredUsers.slice(0, visibleUsers);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} color="#FFA500" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.bookDetails}>
          <Image source={{ uri: bookImage }} style={styles.bookImage} />
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{book.book_info.title}</Text>
            <Text style={styles.bookAuthor}>{book.book_info.author}</Text>
            <Text style={styles.bookDescription}>{book.book_info.description}</Text>
            <Text style={styles.bookRating}>Goodreads rating: {book.book_info.rating}★</Text>
          </View>
        </View>
        <Text style={styles.exchangeTitle}>Intercambia con:</Text>
        {usersToDisplay.length === 0 ? (
          <Text style={styles.noUsers}>No hay usuarios disponibles para tradeo</Text>
        ) : (
          <View style={styles.usersContainer}>
            {usersToDisplay.map((user) => (
              <TouchableOpacity key={user.id} style={styles.user} onPress={() => openModal(user.id)}>
                <Image source={{ uri: userAvatars[user.id] || defaultImage }} style={styles.userAvatar} />
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.userRating}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome key={i} name="star" size={16} color={i < user.rating ? "#FFD700" : "#DDD"} />
                  ))}
                </View>
                <Text style={styles.userExchanges}>{user.exchanges} intercambios</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {filteredUsers.length > visibleUsers && (
          <TouchableOpacity onPress={loadMoreUsers}>
            <Text style={styles.viewMore}>ver más...</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
              <FontAwesome name="times" size={24} color="#000" />
            </TouchableOpacity>
            <Image source={{ uri: bookImage }} style={styles.bookImage} />
            <Text style={styles.bookTitle}>{book.book_info.title}</Text>
            <Text style={styles.bookAuthor}>{book.book_info.author}</Text>
            <Text style={styles.bookDescription}>{book.book_info.description}</Text>
            <Text style={styles.bookRating}>Goodreads rating: {book.book_info.rating}★</Text>
            <Text style={styles.bookYear}>Año de adquisición: {selectedUserBook ? selectedUserBook.antiquity : 'Desconocido'}</Text>
            {videoUrl ? (
              <Video
                source={{ uri: videoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={styles.video}
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Text style={styles.noVideo}>No hay video disponible</Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(selectedUser)}>
                <FontAwesome name="heart" size={24} color={hasLiked[selectedUser] ? "#FF0000" : "#DDD"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => {
                  closeModal();
                  navigation.navigate('UserProfileView', { userId: selectedUser });
                }}
              >
                <Text style={styles.viewProfileText}>Ver Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
  },
  bookDetails: {
    flexDirection: 'row',
    padding: 16,
  },
  bookImage: {
    width: 120,
    height: 180,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },
  bookTitle: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 18,
    marginVertical: 8,
  },
  bookDescription: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 16,
  },
  bookRating: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  exchangeTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  noUsers: {
    textAlign: 'center',
    color: '#777',
    marginTop: 16,
    fontSize: 16,
  },
  usersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
  },
  user: {
    alignItems: 'center',
    margin: 8,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  userRating: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  userExchanges: {
    fontSize: 12,
  },
  viewMore: {
    textAlign: 'center',
    color: '#FFA500',
    marginVertical: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  likeButton: {
    marginRight: 20,
  },
  viewProfileButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
  },
  viewProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bookYear: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 16,
    marginTop: 8,
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  noVideo: {
    fontFamily: 'Typewriter-Bold',
    fontSize: 16,
    color: '#777',
  },
});

export default BookDetails;
