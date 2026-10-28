import { AxiosError, AxiosInstance } from "axios";
import { describe, expect, it, Mock, vi } from "vitest";
import { dataProvider } from ".";

const API = "http://api.test/v1";

type FakeClient = Record<"get" | "post" | "put" | "patch" | "delete" | "head" | "options", Mock>;

// Stands in for the axios instance, so no request ever leaves the test.
const fakeClient = (): FakeClient => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  head: vi.fn(),
  options: vi.fn(),
});

const provider = (client: FakeClient) => dataProvider(API, client as unknown as AxiosInstance);

describe("dataProvider", () => {
  it("getList builds the query string and unwraps a paginated response", async () => {
    const client = fakeClient();
    client.get.mockResolvedValue({
      data: { count: 42, results: [{ id: 1, name: "a" }] },
      headers: {},
    });

    const result = await provider(client).getList({
      resource: "files",
      pagination: { currentPage: 2 },
      sorters: [{ field: "name", order: "desc" }],
      filters: [{ field: "status", operator: "eq", value: "new" }],
    });

    const url: string = client.get.mock.calls[0][0];
    expect(url.startsWith(`${API}/files?`)).toBe(true);
    expect(url).toContain("page=2");
    expect(url).toContain("ordering=-name");
    expect(url).toContain("status=new");
    expect(result).toEqual({ data: [{ id: 1, name: "a" }], total: 42 });
  });

  it("getList accepts a plain array response", async () => {
    const client = fakeClient();
    client.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }], headers: {} });

    const result = await provider(client).getList({ resource: "groups" });

    expect(result).toEqual({ data: [{ id: 1 }, { id: 2 }], total: 2 });
  });

  it("getList skips the page param when pagination is off", async () => {
    const client = fakeClient();
    client.get.mockResolvedValue({ data: [], headers: {} });

    await provider(client).getList({ resource: "files", pagination: { currentPage: 3, mode: "off" } });

    expect(client.get.mock.calls[0][0]).not.toContain("page=");
  });

  it("getList falls back to the x-total-count header", async () => {
    const client = fakeClient();
    client.get.mockResolvedValue({ data: [{ id: 1 }], headers: { "x-total-count": "9" } });

    const result = await provider(client).getList({ resource: "files" });

    expect(result.total).toBe(9);
  });

  it("getMany requests each id only once", async () => {
    const client = fakeClient();
    client.get.mockResolvedValue({ data: { results: [{ id: 1 }, { id: 2 }] } });

    const result = await provider(client).getMany({ resource: "users", ids: [1, 2, 1] });

    expect(client.get).toHaveBeenCalledWith(`${API}/users?id__in=1,2`, { headers: undefined });
    expect(result.data).toHaveLength(2);
  });

  it("create rejects with the backend validation errors", async () => {
    const client = fakeClient();
    const error = new AxiosError("Request failed with status code 400");
    error.response = { status: 400, data: { name: ["This field is required."] } } as any;
    client.post.mockRejectedValue(error);

    await expect(provider(client).create({ resource: "processes", variables: {} })).rejects.toEqual({
      errors: { name: ["This field is required."] },
      statusCode: 400,
      message: "Request failed with status code 400",
    });
  });
});
