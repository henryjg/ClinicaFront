import NProgress from 'nprogress';

//------------------------------------------------------
export const loadingDiv_star =  (elemento: string) => {
    NProgress.configure({
        parent: elemento, // Selector del contenedor
        showSpinner: false, // Opcional: oculta el spinner si no lo necesitas
    });
    NProgress.start();
};

//------------------------------------------------------
export const loadingDiv_end =  () => {
    NProgress.done();
    NProgress.configure({
        parent: 'body', // Selector del contenedor
        showSpinner: true, // Opcional: oculta el spinner si no lo necesitas
    });
};

//------------------------------------------------------
//------------------------------------------------------
export const loading_star =  () => {
    NProgress.start();
};
export const loading_end =  () => {
    NProgress.start();
};

//------------------------------------------------------
//------------------------------------------------------
const ProgressBar = {
    loadingDiv_star,
    loadingDiv_end,
    loading_star,
    loading_end
};

export default ProgressBar;