import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../utils/baseURL';

export const adminStatsApi = createApi({
  reducerPath: 'adminStatsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/admin`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token'); 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/stats',
    }),
  }),
});

export const { useGetAdminStatsQuery } = adminStatsApi;
