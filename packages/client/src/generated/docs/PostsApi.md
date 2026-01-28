# PostsApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPost**](PostsApi.md#createpostoperation) | **POST** /posts | Create a new post |
| [**deletePost**](PostsApi.md#deletepost) | **DELETE** /posts/{id} | Delete a post |
| [**getPostById**](PostsApi.md#getpostbyid) | **GET** /posts/{id} | Get a post by ID |
| [**getPosts**](PostsApi.md#getposts) | **GET** /posts | Get all posts |
| [**getUserPosts**](PostsApi.md#getuserposts) | **GET** /users/{userId}/posts | Get all posts by a user |
| [**updatePost**](PostsApi.md#updatepostoperation) | **PUT** /posts/{id} | Update a post |



## createPost

> Post createPost(createPostRequest)

Create a new post

### Example

```ts
import {
  Configuration,
  PostsApi,
} from '';
import type { CreatePostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostsApi();

  const body = {
    // CreatePostRequest
    createPostRequest: ...,
  } satisfies CreatePostOperationRequest;

  try {
    const data = await api.createPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createPostRequest** | [CreatePostRequest](CreatePostRequest.md) |  | |

### Return type

[**Post**](Post.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Post created successfully |  -  |
| **400** | Invalid request body |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deletePost

> deletePost(id)

Delete a post

### Example

```ts
import {
  Configuration,
  PostsApi,
} from '';
import type { DeletePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeletePostRequest;

  try {
    const data = await api.deletePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Post deleted successfully |  -  |
| **404** | Post not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPostById

> Post getPostById(id)

Get a post by ID

### Example

```ts
import {
  Configuration,
  PostsApi,
} from '';
import type { GetPostByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetPostByIdRequest;

  try {
    const data = await api.getPostById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Post**](Post.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Post found |  -  |
| **404** | Post not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPosts

> Array&lt;Post&gt; getPosts(published)

Get all posts

### Example

```ts
import {
  Configuration,
  PostsApi,
} from '';
import type { GetPostsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostsApi();

  const body = {
    // boolean | Filter by published status (optional)
    published: true,
  } satisfies GetPostsRequest;

  try {
    const data = await api.getPosts(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **published** | `boolean` | Filter by published status | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;Post&gt;**](Post.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of posts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getUserPosts

> Array&lt;Post&gt; getUserPosts(userId)

Get all posts by a user

### Example

```ts
import {
  Configuration,
  PostsApi,
} from '';
import type { GetUserPostsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostsApi();

  const body = {
    // string
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetUserPostsRequest;

  try {
    const data = await api.getUserPosts(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;Post&gt;**](Post.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of posts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updatePost

> Post updatePost(id, updatePostRequest)

Update a post

### Example

```ts
import {
  Configuration,
  PostsApi,
} from '';
import type { UpdatePostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // UpdatePostRequest
    updatePostRequest: ...,
  } satisfies UpdatePostOperationRequest;

  try {
    const data = await api.updatePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **updatePostRequest** | [UpdatePostRequest](UpdatePostRequest.md) |  | |

### Return type

[**Post**](Post.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Post updated successfully |  -  |
| **404** | Post not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

