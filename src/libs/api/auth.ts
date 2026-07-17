import {ssoApi} from "../api";
import type {SuccessResponse, RefreshRequest, RefreshResponse, CheckRefreshTokenRequest} from "./data";

export const refresh = async (
    data: RefreshRequest
): Promise<RefreshResponse> => {
    const response = await ssoApi.post<SuccessResponse<RefreshResponse>>(
        '/auth/refresh',
        data
    );

    if (!response.data.data) {
        throw new Error('Response data is missing');
    }

    return response.data.data;
};

export const checkRefreshToken = async (
    data: CheckRefreshTokenRequest
): Promise<SuccessResponse<null>> => {
    const response = await ssoApi.post<SuccessResponse<null>>(
        '/auth/check_refresh_token',
        data
    );

    return response.data;
};