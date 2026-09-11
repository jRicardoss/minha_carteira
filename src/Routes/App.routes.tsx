import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import List from '../pages/List';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from './PrivateRoute';

const comLayout = (Componente: React.ComponentType<any>) => (props: any) => (
    <Layout>
        <Componente {...props} />
    </Layout>
);

const AppRoutes: React.FC = () => (
    <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/cadastro" exact component={Register} />

        <PrivateRoute path="/" exact component={comLayout(Dashboard)} />
        <PrivateRoute path="/list/:type" exact component={comLayout(List)} />
    </Switch>
);

export default AppRoutes;