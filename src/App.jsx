
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from './components/Searchbar/Searchbar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import ImageGalleryItem from './components/ImageGalleryItem/ImageGalleryItem';
import Button from './components/Button/Button';
import Modal from './components/Modal/Modal';
import Loader from './components/Loader/Loader';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [largeImageUrl, setLargeImageUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `https://pixabay.com/api/?q=${searchQuery}&page=${currentPage}&key=38138033-59618da37527b2e085afc0aca&image_type=photo&orientation=horizontal&per_page=12`
        );

        const newImages = response.data.hits;
        const totalImages = response.data.totalHits;

        if (currentPage === 1) {
          setImages(newImages);
        } else {
          setImages(prevImages => [...prevImages, ...newImages]);
        }

        if (totalImages <= currentPage * 12) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (!initialLoadComplete) {
          setInitialLoadComplete(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery !== '') {
      if (searchQuery !== lastSearchQuery) {
        setImages([]);
        setCurrentPage(1);
        setLastSearchQuery(searchQuery);
        setHasMore(true);
      }
      fetchImages();
    }
  }, [searchQuery, currentPage, lastSearchQuery, initialLoadComplete]);

  const handleImageClick = imageUrl => {
    setLargeImageUrl(imageUrl);
    setShowModal(true);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      setCurrentPage(prevPage => prevPage + 1);
      await axios.get(
        `https://pixabay.com/api/?q=${searchQuery}&page=${currentPage + 1}&key=38138033-59618da37527b2e085afc0aca&image_type=photo&orientation=horizontal&per_page=12`
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const closeModal = () => {
    setLargeImageUrl('');
    setShowModal(false);
  };

  return (
    <div>
      <Searchbar onSubmit={setSearchQuery} />
      <ImageGallery>
        {images.map(image => (
          <ImageGalleryItem
            key={image.id}
            webformatURL={image.webformatURL}
            largeImageURL={image.largeImageURL}
            onClick={() => handleImageClick(image.largeImageURL)}
          />
        ))}
      </ImageGallery>
      {isLoading && <Loader />}
      {initialLoadComplete && hasMore && !isLoadingMore && (
        <Button onClick={handleLoadMore}>
          {isLoadingMore ? 'Завантаження...' : 'Завантажити ще'}
        </Button>
      )}
      {showModal && (
        <Modal largeImageURL={largeImageUrl} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;


      
