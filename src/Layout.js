import React from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import useBodyClass from './hooks/body-class';
import './Layout.css';

export default function Layout(props) {

  useBodyClass("layout");

  return (
    <>
      <main className="container-fluid d-flex flex-column" id="routeContent">
        {props.children}
      </main>
    </>
  );
}