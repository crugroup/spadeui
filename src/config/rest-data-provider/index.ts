import { DataProvider } from "@refinedev/core";
import { AxiosInstance, isAxiosError } from "axios";
import queryString from "query-string";
import { generateFilter, generateSort } from "./utils";
import axiosHelper from "../../helpers/axios-token-interceptor";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export const DEFAULT_PAGE_SIZE = 100;

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosHelper.axiosInstance
): Omit<Required<DataProvider>, "createMany" | "updateMany" | "deleteMany"> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const queryFilters = generateFilter(filters);

    const query: {
      page?: number;
      ordering?: string;
    } = {};

    if (mode === "server") {
      query.page = current;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      query.ordering = generatedSort;
    }

    const { data, headers } = await httpClient[requestMethod](
      `${url}?${queryString.stringify(query)}&${queryString.stringify(queryFilters)}`,
      {
        headers: headersFromMeta,
      }
    );

    const total = data.count ?? +headers["x-total-count"] ?? data.length;

    return {
      data: Array.isArray(data) ? data : data.results,
      total: total || data.length,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";
    const uniqueIds = Array.from(new Set(ids));

    const { data } = await httpClient[requestMethod](`${apiUrl}/${resource}?id__in=${uniqueIds.join(",")}`, {
      headers,
    });

    return {
      data: data.results,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    try {
      const { data } = await httpClient[requestMethod](url, variables, {
        headers,
      });

      return {
        data,
      };
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        return Promise.reject({
          errors: err.response.data,
          statusCode: err.code,
        });
      } else {
        return Promise.reject(err);
      }
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "patch";

    try {
      const { data } = await httpClient[requestMethod](url, variables, {
        headers,
      });

      return {
        data,
      };
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        return Promise.reject({
          errors: err.response.data,
          statusCode: err.code,
        });
      } else {
        return Promise.reject(err);
      }
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](url, { headers });

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";

    const { data } = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    });

    return {
      data,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    let requestUrl = `${url}?`;

    if (sorters) {
      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const sortQuery = {
          ordering: generatedSort,
        };
        requestUrl = `${requestUrl}&${queryString.stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${queryString.stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${queryString.stringify(query)}`;
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload, {
          headers,
        });
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          data: payload,
          headers: headers,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl, {
          headers,
        });
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
});
