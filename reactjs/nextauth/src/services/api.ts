import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing = false;
let failedRequestsQueue = [] as {
    onSuccess(token: string): void;
    onFailure(error: AxiosError): void;
}[];

type Context = undefined | GetServerSidePropsContext;

export function setupAPIClient(ctx: Context = undefined) {
let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies['nextauth.token']}`
        }
    })
    
    const thirdDays = 60 * 60 * 24 * 30;
    
    api.interceptors.response.use(
        response => response,
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                if ( error.response.data?.code === 'token.expired') {
                    cookies = parseCookies(ctx);
    
                    const { 'nextauth.refreshToken': refreshToken } = cookies;
    
                    const originalConfig = error.config;
    
                    if (!isRefreshing) {
                        isRefreshing = true;

                        api.post('/refresh', {
                            refreshToken,
        
                        }).then(response => {
                            const { token, refreshToken: newRefreshToken } = response.data;
        
                            setCookie(ctx, 'nextauth.token', token, {
                                maxAge: thirdDays,
                                path: '/',
                            });
        
                            setCookie(ctx, 'nextauth.refreshToken', newRefreshToken, {
                                maxAge: thirdDays,
                                path: '/',
                            });
        
                            api.defaults.headers['Authorization'] = `Bearer ${token}`;
    
                            failedRequestsQueue.forEach(request => request.onSuccess(token));
                            failedRequestsQueue = [];
        
                        }).catch((error => {
                            failedRequestsQueue.forEach(request => request.onFailure(error));
                            failedRequestsQueue = [];
    
                            if (process.browser) {
                                signOut();
                            }
                        })).finally(() => {
                            isRefreshing = false;
                        })
                    }
    
                    return new Promise((resolve, reject) => {
                        failedRequestsQueue.push({
                            onSuccess: (token: string) => {
                                originalConfig.headers['Authorization'] = `Bearer ${token}`;
    
                                resolve(api(originalConfig));
                            },
                            onFailure: (error: AxiosError) => {
                                reject(error);
                            },
                        })
                    });
                } else {
                    if (process.browser) {
                        signOut();
                    } else {
                        return Promise.reject(new AuthTokenError())
                    }
                }
            }
    
            return Promise.reject(error);
    })

    return api;
}