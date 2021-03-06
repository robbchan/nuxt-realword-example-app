import { request } from "@/plugins/request";

export const addComment = (slug, data) => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: "POST",
    data
  });
};

export const getComments = slug => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: "GET"
  });
};
