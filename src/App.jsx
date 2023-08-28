
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
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `https://pixabay.com/api/?q=${searchQuery}&page=${currentPage}&key=38138033-59618da37527b2e085afc0aca&image_type=photo&orientation=horizontal&per_page=12`
        );

        const newImages = response.data.hits;
        const totalImages = response.data.totalHits;

        if (totalImages <= currentPage * 12) {
          setHasMore(false);
        }

        setImages(prevImages => [...prevImages, ...newImages]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery !== '' && currentPage === 1) {
      setImages([]);
      setHasMore(true);
    }

    if (searchQuery !== '') {
      fetchImages();
    }
  }, [searchQuery, currentPage]);

  const handleImageClick = imageUrl => {
    setLargeImageUrl(imageUrl);
    setShowModal(true);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
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
      {!isLoading && images.length > 0 && hasMore && (
        <Button onClick={handleLoadMore}>Load more</Button>
      )}
      {showModal && (
        <Modal largeImageURL={largeImageUrl} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;