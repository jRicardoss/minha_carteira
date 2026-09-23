import React from "react";

import {
    Route,
    Redirect,
    RouteProps,
} from "react-router-dom";

import {
    useAuth,
} from "../Hooks/auth";

interface IPrivateRouteProps
    extends RouteProps {
    component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<
    IPrivateRouteProps
> = ({
    component: Component,
    ...rest
}) => {

    const {
        usuario,
        loading,
    } = useAuth();

    if (loading) {
        return null;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                usuario ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;