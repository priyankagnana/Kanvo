import fetchClient from "./fetchClient";

const sectionApi = {
    create: (boardId) => fetchClient(`boards/${boardId}/sections`, 'POST'),
    update : (boardId,sectionId,params) => fetchClient(`boards/${boardId}/sections/${sectionId}`,'PUT',params),
    delete : (boardId,sectionId) => fetchClient(`boards/${boardId}/sections/${sectionId}`,'DELETE')
}

export default sectionApi;