
  // src/utils/FechaFormatter.ts
export class Loadingview {
    static show_loader () {
        const elem = document.querySelector('.loader') as HTMLElement;
        if (elem) {
          elem.style.display = 'flex';
          elem.style.opacity = '1';
          elem.style.transition = 'opacity 0.3s ease'; // Smooth transition
        }
    };
    
    static unload_loader ()  {
        const elem = document.querySelector('.loader') as HTMLElement;
        if (elem) {
          elem.style.opacity = '0';
          elem.style.transition = 'opacity 0.3s ease'; // Smooth transition
          // Hide after transition ends
          elem.addEventListener('transitionend', () => {
            elem.style.display = 'none';
          }, { once: true }); // Listener runs only once
        }
    };
}
