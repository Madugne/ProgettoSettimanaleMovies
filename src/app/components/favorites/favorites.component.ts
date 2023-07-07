import { Component, OnInit } from '@angular/core';
import { MoviesService } from 'src/app/service/movies.service';
import { Movie } from 'src/app/models/movie.interface';
import { Favourite } from 'src/app/models/favourite.interface';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
    user: Auth | null = null;
    favoriti: Movie[] = [];

    constructor(
        private movieSrv: MoviesService,
        private authSrv: AuthService
    ) {}

    ngOnInit(): void {
        this.authSrv.user$.subscribe((userData) => {
            this.user = userData;
            this.recuperaFavoriti();
        });
    }

    recuperaFavoriti(): void {
        if (this.user) {
            this.movieSrv
                .recuperaFavoriti(this.user.user.id)
                .subscribe((favoriti: Favourite[]) => {
                    const movieIds = favoriti.map((f: Favourite) => f.movieId);
                    this.movieSrv
                        .recuperaFilm()
                        .subscribe((movies: Movie[]) => {
                            this.favoriti = movies.filter((m: Movie) =>
                                movieIds.includes(m.id)
                            );
                        });
                });
        }
    }
}
