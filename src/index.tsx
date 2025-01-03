import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "@cloudscape-design/global-styles/index.css";
import Layout from './component/Layout';
import {BrowserRouter, Route, Routes} from 'react-router';
import Auth, {AuthType} from "./component/pages/auth/Auth";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Profile from "./component/pages/profile/Profile";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Home from "./component/pages/home/Home";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home/>}/>
                        <Route path='profile*' element={<Profile/>}/>
                    </Route>
                    <Route path="/auth">
                        <Route index element={<Auth/>}/>
                        <Route path='create' element={<Auth type={AuthType.CREATE}/>}/>
                        <Route path='login' element={<Auth type={AuthType.LOGIN}/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
            <ReactQueryDevtools/>
        </QueryClientProvider>
    </React.StrictMode>
);
