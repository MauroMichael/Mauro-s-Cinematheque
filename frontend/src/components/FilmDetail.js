import styles from '../styles/FilmDetail.module.css';

function FilmDetail({ film, onBack }) {
    return (
        <main className={styles.detailPage}>
            <article className={styles.detailCard}>
                {film.imageUrl && <img src={film.imageUrl} alt={film.name} className={styles.poster} />}
                <div className={styles.info}>
                    <h1 className={styles.title}>{film.name}</h1>
                    <h2 className={styles.metaItem}>
                        <strong>Sector:</strong>{' '}
                        <span className={styles.highlight}>
                            {film.sector || 'Sin sector'}
                        </span>
                    </h2>

                    <h2 className={styles.metaItem}>
                        <strong>Code:</strong>{' '}
                        <span className={styles.highlight}>
                            {film.code || 'Sin código'}
                        </span>
                    </h2>

                    <h2 className={styles.metaItem}>
                        <strong>Format:</strong>{' '}
                        <span className={styles.highlight}>
                            {film.format}
                        </span>
                    </h2>
                    <p className={styles.metaItem}>
                        <strong>Length:</strong> {film.length || 'Sin duración'} minutos
                    </p>

                    <p className={styles.metaItem}>
                        <strong>Genre:</strong> {film.genre || 'Sin género'}
                    </p>

                    <p className={styles.metaItem}>
                        <strong>Year:</strong> {film.year || 'Sin año'}
                    </p>

                    <p className={styles.metaItem}>
                        <strong>Country:</strong> {film.country || 'Sin país'}
                    </p>
                </div>
            </article>
            <button className={styles.backButton} onClick={onBack}>
                <span className={styles.backArrow} aria-hidden="true">
                    ←
                </span> Back
            </button>
        </main>
    );
}

export default FilmDetail;
