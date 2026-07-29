import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export type GraphqlResponse<_Data = JsonValue> = {
	data?: _Data
	errors?: readonly {
		message?: string
	}[]
}

const readBoundedGraphqlResponse = async <_Data>(
	binding: SourceBinding,
	response: Response,
	maximumResponseBytes: number
) => {
	const declaredLength = Number(response.headers.get('content-length'))
	if (Number.isFinite(declaredLength) && declaredLength > maximumResponseBytes)
		throw new Error(`${binding.source} GraphQL: response exceeds byte limit`)
	if (response.body == null)
		throw new Error(`${binding.source} GraphQL: response body is missing`)

	const reader = response.body.getReader()
	const chunks: Uint8Array[] = []
	let byteLength = 0

	for (;;) {
		const { done, value } = await reader.read()
		if (done)
			break
		byteLength += value.byteLength
		if (byteLength > maximumResponseBytes) {
			await reader.cancel()
			throw new Error(`${binding.source} GraphQL: response exceeds byte limit`)
		}
		chunks.push(value)
	}

	const bytes = new Uint8Array(byteLength)
	let offset = 0
	for (const chunk of chunks) {
		bytes.set(chunk, offset)
		offset += chunk.byteLength
	}
	if (!response.ok)
		throw new Error(`${binding.source} GraphQL: ${response.status} ${response.statusText}`)

	return JSON.parse(new TextDecoder().decode(bytes)) as GraphqlResponse<_Data>
}

export const graphql = async <_Data = JsonValue>({
	binding,
	maximumResponseBytes,
	query,
	variables,
}: {
	binding: SourceBinding
	maximumResponseBytes?: number
	query: string
	variables?: JsonValue
}) => {
	const response = await sourceFetch(binding, firstHttpUrlForBinding(binding), {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			query,
			...(variables != null && { variables }),
		}),
	})

	if (maximumResponseBytes == null) {
		if (!response.ok)
			await throwHttpError(`${binding.source} GraphQL`, response)
	}

	const payload = maximumResponseBytes == null ?
		await response.json<GraphqlResponse<_Data>>()
	:
		await readBoundedGraphqlResponse<_Data>(binding, response, maximumResponseBytes)
	if (payload.errors?.[0]?.message != null)
		throw new Error(`${binding.source} GraphQL: ${payload.errors[0].message}`)

	return payload.data
}
