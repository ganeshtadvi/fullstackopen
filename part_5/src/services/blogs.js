import axios from "axios";
const baseUrl = "http://localhost:8000/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const addBlog = async (dataObj, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const request = await axios.post(baseUrl, dataObj, config);
  return request.data;
};

const updateBlog = async (blogObject, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const request = await axios.put(
    `${baseUrl}/${blogObject.id}`,
    blogObject,
    config,
  );
  return request.data;
};

const deleteBlog = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const request = await axios.delete(`${baseUrl}/${id}`, config);
  return request.data;
};

const getBlogById = async (id) => {
  const request = await axios.get(`${baseUrl}/${id}`);
  return request.data;
};

export { getAll, addBlog, updateBlog, getBlogById, deleteBlog };
