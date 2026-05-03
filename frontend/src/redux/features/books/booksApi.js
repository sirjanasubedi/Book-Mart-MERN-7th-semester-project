import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/books`,
  credentials: 'include',
  prepareHeaders: (headers, { arg }) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // ✅ Don't set Content-Type for FormData — browser sets it automatically
    if (arg?.body instanceof FormData) {
      headers.delete('Content-Type');
    }
    return headers;
  },
});

const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery,
  tagTypes: ['Books'],
  endpoints: (builder) => ({
    fetchAllBooks: builder.query({
      query: () => '/',
      providesTags: ['Books'],
    }),
    fetchBookById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Books', id }],
    }),
    // ✅ No Content-Type header — works with FormData
    addBook: builder.mutation({
      query: (formData) => ({
        url: '/create-book',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),
    addReview: builder.mutation({
      query: ({ id, ...reviewData }) => ({
        url: `/${id}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Books'],
    }),
    likeBook: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/${id}/like`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['Books'],
    }),
    trackBookView: builder.mutation({
      query: (id) => ({
        url: `/${id}/view`,
        method: 'POST',
      }),
    }),
    getRecommendedBooks: builder.query({
      query: ({ id, category }) => `/${id}/recommendations?category=${category}`,
      providesTags: ['Books'],
    }),
  }),
});

export const {
  useFetchAllBooksQuery,
  useFetchBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useAddReviewMutation,
  useLikeBookMutation,
  useTrackBookViewMutation,
  useGetRecommendedBooksQuery,
} = booksApi;

export default booksApi;