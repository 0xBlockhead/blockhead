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

export const graphql = async <_Data = JsonValue>({
	binding,
	query,
	variables,
}: {
	binding: SourceBinding
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

	if (!response.ok)
		await throwHttpError(`${binding.source} GraphQL`, response)

	const payload = await response.json<GraphqlResponse<_Data>>()
	if (payload.errors?.[0]?.message != null)
		throw new Error(`${binding.source} GraphQL: ${payload.errors[0].message}`)

	return payload.data
}
