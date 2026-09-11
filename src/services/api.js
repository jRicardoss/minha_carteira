import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(
            "@MinhaCarteira:token"
        );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        const method =
            response.config.method?.toLowerCase();

        const url =
            response.config.url || "";

        const methodsThatChangeData = [
            "post",
            "put",
            "patch",
            "delete",
        ];

        if (
            methodsThatChangeData.includes(
                method
            ) &&
            url.includes("/transacoes")
        ) {
            window.dispatchEvent(
                new Event(
                    "transacoesAtualizadas"
                )
            );
        }

        return response;
    },

    (error) => {
        if (
            error.response?.status === 401
        ) {
            localStorage.removeItem(
                "@MinhaCarteira:token"
            );

            localStorage.removeItem(
                "@MinhaCarteira:usuario"
            );
        }

        return Promise.reject(error);
    }
);

export default api;