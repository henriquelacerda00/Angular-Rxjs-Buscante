import { FormControl } from '@angular/forms';
import { Item,LivrosResultado,  } from './../../models/interfaces';
import { Component,  } from '@angular/core';
import { catchError, debounceTime, filter, iif, map, of, switchMap, tap, throwError,  } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';
import { animationBooksTrigger } from 'src/animations';



const Pausa = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
  animations: [animationBooksTrigger]
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  animationState = '';
  LivrosResultado: LivrosResultado;

  constructor(private service: LivroService) {}

  totalLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(Pausa),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log("fluxo inicial")),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.LivrosResultado = resultado),
    catchError(erro => {
      console.log(erro);
      return of();
    })
  );

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(Pausa),
    tap((valorDigitado) => {
      if (valorDigitado === '') {
        this.mensagemErro = '';
        this.LivrosResultado.totalItems = 0;
      }

      // Atualiza o estado de animação com valor único
      this.animationState = valorDigitado + Date.now();
    }),
    switchMap((valorDigitado) =>
      iif(
        () => valorDigitado === '',
        of([]),
        of(valorDigitado).pipe(
          filter((valor) => valor.length >= 3),
          tap(() => console.log('fluxo inicial')),
          switchMap((valor) => this.service.buscar(valor)),
          tap(() => console.log('requisição ao servidor')),
          map((resultado) => resultado.items ?? []),
          map((items) => this.livrosResultadoParaLivros(items)),
          catchError(erro => {
            console.log(erro);
            return throwError(() => new Error(this.mensagemErro = 'ops, erro. Recarregue a aplicação'));
          })
        )
      )
    )
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
  return items.map(item => new LivroVolumeInfo(item)); // Aqui estamos criando uma instância de LivroVolumeInfo
  }


}
