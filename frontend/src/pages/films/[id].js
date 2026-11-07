import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getFilmById } from "../../api/films";
import FilmDetail from "../../components/FilmDetail";

function FilmDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const [film, setFilm] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!router.isReady) {
            return
        }

        async function loadFilm() {
            try {
                const data = await getFilmById(id);
                setFilm(data);
            } catch (err) {
                setError('Could not fetch film details. Please try again later.');
            }
        }
        loadFilm();
    }, [id, router.isReady]);

    function handleBack() {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    }

    if (!router.isReady || (!film && !error)) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return <FilmDetail film={film} onBack={handleBack} />;
}

export default FilmDetailPage;
