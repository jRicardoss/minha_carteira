import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001/api",
});

api.interceptors.response.use(
    (response) => {
        const method = response.config.method?.toLowerCase();
        const url = response.config.url || "";

        const methodsThatChangeData = [
            "post",
            "put",
            "patch",
            "delete",
        ];

        if (
            methodsThatChangeData.includes(method) &&
            url.includes("/transacoes")
        ) {
            window.dispatchEvent(
                new Event("transacoesAtualizadas")
            );
        }

        return response;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;