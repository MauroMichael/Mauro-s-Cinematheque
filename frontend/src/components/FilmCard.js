import styles from '../styles/FilmCard.module.css';
import Link from 'next/link';

export function FilmCard({ film }) {
    return (
        <Link href={`/films/${film.id}`} passHref>
            <div className={styles.filmCard}>
                <img src={film.imageUrl} alt={film.name} className={styles.filmImage} />
                <div className={styles.filmDetails}>
                    <h2 className={styles.filmName}>{film.name}</h2>
                    <p>Year: {film.year}</p>
                    <p>Format: {film.format}</p>
                </div>
            </div>
        </Link>
    );
}
