import React from 'react';
import ReactDOM from 'react-dom/client';
import PageComponent from './components/customerGUI/CustomerPageComponent.jsx';
import CGUI from './components/customerGUI/CGUI.jsx';
// import PageComponent from './components/customerHomePage.jsx';
import { useData,DataProvider} from './components/customerGUI/FetchData';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CGUI />
);
