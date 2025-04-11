import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useRating = (movieId: string) => {
  const [user] = useAuthState(auth);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingsCount, setRatingsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
        setIsLoading(true);
        try {
          // Получаем общие данные о рейтингах (доступны всем)
          const movieDoc = await getDoc(doc(db, 'movies', movieId));
          
          if (movieDoc.exists()) {
            setAverageRating(movieDoc.data().averageRating || 0);
            setRatingsCount(movieDoc.data().ratingsCount || 0);
          } else {
            // Инициализируем документ фильма, если он не существует
            await setDoc(doc(db, 'movies', movieId), {
              averageRating: 0,
              ratingsCount: 0
            });
          }
      
          // Получаем рейтинг пользователя (только для аутентифицированных)
          if (user) {
            try {
              const userRatingDoc = await getDoc(
                doc(db, 'movies', movieId, 'ratings', user.uid)
              );
              if (userRatingDoc.exists()) {
                setUserRating(userRatingDoc.data().value);
              }
            } catch (userRatingError) {
              console.error("Error fetching user rating:", userRatingError);
              // Продолжаем работу даже если не удалось получить пользовательский рейтинг
            }
          }
        } catch (error) {
          console.error("Error fetching movie ratings:", error);
          // Сбрасываем состояние в случае ошибки
          setAverageRating(0);
          setRatingsCount(0);
          setUserRating(null);
        } finally {
          setIsLoading(false);
        }
      };

    fetchRatings();
  }, [movieId, user]);

  const rateMovie = async (rating: number) => {
    if (!user) return;

    try {
      // Создаем или обновляем документ фильма
      const movieRef = doc(db, 'movies', movieId);
      const movieDoc = await getDoc(movieRef);
      
      if (!movieDoc.exists()) {
        await setDoc(movieRef, {
          averageRating: 0,
          ratingsCount: 0
        });
      }

      // Сохраняем рейтинг пользователя
      await setDoc(
        doc(db, 'movies', movieId, 'ratings', user.uid),
        { value: rating }
      );

      // Обновляем агрегированные данные
      const updatedMovieDoc = await getDoc(movieRef);
      const currentData = updatedMovieDoc.data() || {
        averageRating: 0,
        ratingsCount: 0
      };
      
      let { averageRating: currentAvg, ratingsCount: currentCount } = currentData;
      let newAverage = currentAvg;
      let newCount = currentCount;

      if (userRating !== null) {
        // Пользователь меняет оценку
        newAverage = (currentAvg * currentCount - userRating + rating) / currentCount;
      } else {
        // Новая оценка
        newCount = currentCount + 1;
        newAverage = (currentAvg * currentCount + rating) / newCount;
      }

      await updateDoc(movieRef, {
        averageRating: newAverage,
        ratingsCount: newCount
      });

      setUserRating(rating);
      setAverageRating(newAverage);
      setRatingsCount(newCount);
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  return {
    userRating,
    averageRating,
    ratingsCount,
    isLoading,
    rateMovie
  };
};