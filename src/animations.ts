import { animate, group, query, stagger, style, transition, trigger } from "@angular/animations";

export const animationBooksTrigger = trigger('booksAnimation', [
  transition('* => *', [
    group([
      // ➡️ Animação de ENTRADA (primeiro os novos entram)
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        stagger(200, [
          animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ], { optional: true }),

      // ⬅️ Animação de SAÍDA (depois os antigos saem)
      query(':leave', [
        stagger(100, [
          animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
        ])
      ], { optional: true })
    ])

  ])

]);
