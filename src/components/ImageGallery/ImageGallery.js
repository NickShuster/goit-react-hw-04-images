import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageGallery.module.css';

const ImageGallery = ({ children }) => (
  <ul className={styles.gallery}>{children}</ul>
);

ImageGallery.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ImageGallery;