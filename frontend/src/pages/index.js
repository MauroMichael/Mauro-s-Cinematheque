import { useEffect, useState } from 'react';
import { getAllFilms } from '../api/films';
import styles from '../styles/Home.module.css';
import { FilmCard } from '../components/FilmCard';

export default function Home() {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilms() {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllFilms();
        setFilms(response.films ?? response);
      } catch (error) {
        console.error('Error fetching films:', error);
        setError('Failed to fetch films. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Cinemáurico Films</h1>
      {loading && (
        <div className={styles.cinemaLoader}>
          <div className={styles.loaderTrack}>
            <div className={styles.flameTrail} />
            <img
              src="/delorean.png"
              alt="DeLorean"
              className={styles.deloreanImage}
            />
          </div>

          <p className={styles.loaderText}>Loading at 88 mph...</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p >}

      {!loading && films.length === 0 && <p>No films available.</p>}

      {films.length > 0 && (
        <div className={styles.filmContainer}>
          {films.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      )}
    </main>
  );
}