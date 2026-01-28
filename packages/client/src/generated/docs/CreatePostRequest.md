
# CreatePostRequest


## Properties

Name | Type
------------ | -------------
`title` | string
`content` | string
`published` | boolean
`authorId` | string

## Example

```typescript
import type { CreatePostRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "content": null,
  "published": null,
  "authorId": null,
} satisfies CreatePostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


