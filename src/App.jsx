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
    if (searchQuery) {
      fetchImages();
    }
  }, [searchQuery]);

  const onChangeQuery = query => {
    setSearchQuery(query);
    setImages([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  const fetchImages = () => {
    setIsLoading(true);

    axios
      .get(
        `https://pixabay.com/api/?q=${searchQuery}&page=${currentPage}&key=38138033-59618da37527b2e085afc0aca&image_type=photo&orientation=horizontal&per_page=12`
      )
      .then(response => {
        const newImages = response.data.hits;
        const totalImages = response.data.totalHits;

        if (totalImages <= currentPage * 12) {
          setHasMore(false);
        }

        setImages(prevImages => [...prevImages, ...newImages]);
        setCurrentPage(prevPage => prevPage + 1);
      })
      .catch(error => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const openModal = largeImageUrl => {
    setLargeImageUrl(largeImageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setLargeImageUrl('');
    setShowModal(false);
  };

  return (
    <div>
      <Searchbar onSubmit={onChangeQuery} />
      <ImageGallery>
        {images.map(image => (
          <ImageGalleryItem
            key={image.id}
            webformatURL={image.webformatURL}
            largeImageURL={image.largeImageURL}
            onClick={openModal}
          />
        ))}
      </ImageGallery>
      {isLoading && <Loader />}
      {!isLoading && images.length > 0 && hasMore && (
        <Button onClick={fetchImages}>Load more</Button>
      )}
      {showModal && (
        <Modal
          largeImageURL={largeImageUrl}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;