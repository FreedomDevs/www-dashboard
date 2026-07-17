import {
    createMutation,
    type CreateMutationOptions,
} from "@tanstack/svelte-query";


import type {ErrorResponse, RefreshRequest, RefreshResponse} from "../data";
import {refresh} from "../auth";

export function createRefreshMutation(
    options?: Omit<
        CreateMutationOptions<RefreshResponse, ErrorResponse, RefreshRequest>,
        "mutationKey" | "mutationFn"
    >
) {
    return createMutation(() => ({
        mutationKey: ["refresh"],
        mutationFn: refresh,
        ...options,
    }));
}