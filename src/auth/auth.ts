import { authLoading, userId } from "./authStore";

export async function initAuth() {
    const refreshToken = localStorage.getItem("refreshToken");

    // нет рефреша -> сразу SSO
    if (!refreshToken) {
        redirectToSSO();
        return;
    }

    try {
        // TODO
        // const me = await api.get("/me");
        //
        // userId.set(me.id);

        // Пока для тестов
        userId.set(1);

    } catch {
        // Если axios после refresh всё равно словил 401
        // значит рефреш тоже умер.
        redirectToSSO();
        return;
    }

    authLoading.set(false);
}

function redirectToSSO() {
    // TODO
    // window.location.href = "...";

    console.log("Redirect to SSO");
}