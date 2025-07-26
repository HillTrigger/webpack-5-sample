// scss
import '@scss/styles.scss';

// svg
import '@modules/_svg';

// components
// import '@components/Scrollbar';
// import '@components/Modal';
// import '@components/Dropdown';
// import '@components/Select';
import '@components/Mask';
import '@components/PasswordToggler';
import '@components/Accordion';
import '@components/TabsController';

// modules
import '@modules/tippy';

// example async chunks
(async () => {
  await import(
    /* webpackChunkName: "Scrollbar" */
    '@components/Scrollbar'
  );
  await import(
    /* webpackChunkName: "Modal" */
    '@components/Modal'
  );
  await import(
    /* webpackChunkName: "Dropdown" */
    '@components/Dropdown'
  );
  await import(
    /* webpackChunkName: "Select" */
    '@components/Select'
  );
})();
