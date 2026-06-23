import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type { AzureAiFoundryJson } from '$/sources/AzureAiFoundry/Rest/types.ts'

const getJson = async ({
	binding,
	path,
	credential,
}: {
	binding: SourceBinding
	path: string
	credential: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		headers: {
			'api-key': credential,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<AzureAiFoundryJson>()
}

export const listDeployments = ({
	binding,
	credential,
	apiVersion,
}: {
	binding: SourceBinding
	credential: string
	apiVersion: string
}) => getJson({
	binding,
	path: `/openai/deployments?${new URLSearchParams({ 'api-version': apiVersion })}`,
	credential,
})
