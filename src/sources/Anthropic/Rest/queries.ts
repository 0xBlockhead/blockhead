import { type } from 'arktype'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'

const anthropicModelWire = type({
	type: "'model'",
	id: 'string > 0',
	display_name: 'string > 0',
	created_at: 'string > 0',
})
const anthropicModelListWire = type({
	data: anthropicModelWire.array(),
	has_more: 'boolean',
	'first_id?': 'string > 0',
	'last_id?': 'string > 0',
})


const requestAnthropicJson = async (binding: SourceBinding, {
	path,
	credential,
	anthropicVersion,
}: {
	path: string
	credential: string
	anthropicVersion: string
}) => {
	if (credential.trim() === '')
		throw new Error('Anthropic_Rest: missing runtime credential ANTHROPIC_API_KEY')

	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		redirect: 'manual',
		headers: {
			'anthropic-version': anthropicVersion,
			'x-api-key': credential,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<unknown>()
}

const assertModel = (response: unknown) => {
	try {
		return anthropicModelWire.assert(response)
	} catch {
		throw new Error('Anthropic_Rest: invalid model response envelope')
	}
}

const assertModelList = (response: unknown) => {
	try {
		return anthropicModelListWire.assert(response)
	} catch {
		throw new Error('Anthropic_Rest: invalid model list response envelope')
	}
}

export const listModels = ({
	binding,
	credential,
	anthropicVersion,
}: {
	binding: SourceBinding
	credential: string
	anthropicVersion: string
}) => requestAnthropicJson(binding, {
	path: '/v1/models',
	credential,
	anthropicVersion,
}).then(assertModelList)

export const retrieveModel = ({
	binding,
	modelId,
	credential,
	anthropicVersion,
}: {
	binding: SourceBinding
	modelId: string
	credential: string
	anthropicVersion: string
}) => requestAnthropicJson(binding, {
	path: `/v1/models/${encodeURIComponent(modelId)}`,
	credential,
	anthropicVersion,
}).then(assertModel)
