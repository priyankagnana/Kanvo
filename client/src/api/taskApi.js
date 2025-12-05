import fetchClient from "./fetchClient";
import queryString from 'query-string';

const taskApi = {
    create : (boardId,params) => fetchClient(`boards/${boardId}/tasks`,'POST',  params),
    updatePosition : (boardId, params) => fetchClient(`boards/${boardId}/tasks/update-position`,'PUT', params),
    delete : (boardId, taskId) => fetchClient(`boards/${boardId}/tasks/${taskId}`,'DELETE'),
    update : (boardId, taskId,params) => fetchClient(`boards/${boardId}/tasks/${taskId}`,'PUT',params),
    search : (boardId, params = {}) => {
        const query = queryString.stringify(params);
        return fetchClient(`boards/${boardId}/tasks/search${query ? `?${query}` : ''}`, 'GET');
    }
}

export default taskApi;