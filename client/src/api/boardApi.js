import fetchClient from "./fetchClient";
import queryString from 'query-string';

const boardApi = {
  create: () => fetchClient('boards', 'POST'),
  getAll: (params = {}) => {
    const query = queryString.stringify(params);
    return fetchClient(`boards${query ? `?${query}` : ''}`, 'GET');
  },
  updatePosition: (params) => fetchClient('boards', 'PUT', params),
  getOne: (id) => fetchClient(`boards/${id}`, 'GET'),
  delete: (id) => fetchClient(`boards/${id}`, 'DELETE'),
  update : (id,params) => fetchClient(`boards/${id}`,'PUT',params),
  getFavourites : () => fetchClient(`boards/favourites`),
  updateFavouritePosition : (params) => fetchClient(`boards/favourites`,'PUT',params)
};

export default boardApi;
