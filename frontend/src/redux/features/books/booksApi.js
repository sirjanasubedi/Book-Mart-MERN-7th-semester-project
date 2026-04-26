import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/books`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
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
    addBook: builder.mutation({
      query: (newBook) => ({
        url: '/create-book',
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: 'PUT',
        body: rest,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
    
    
    
  





//   }),
// });

// export const {
//   useFetchAllBooksQuery,
//   useFetchBookByIdQuery,
//   useAddBookMutation,
//   useUpdateBookMutation,
//   useDeleteBookMutation,


 

// } = booksApi;

// export default booksApi;
