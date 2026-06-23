import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import type { BlockfrostJson } from '$/sources/Blockfrost/Rest/types.ts'

export const request = async ({
	binding,
	path,
	projectId,
}: {
	binding: SourceBinding
	path: string
	projectId: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		headers: { project_id: projectId },
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<BlockfrostJson>()
}
