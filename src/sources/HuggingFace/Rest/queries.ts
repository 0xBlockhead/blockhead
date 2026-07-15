import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { sourceGetText } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type {
	HuggingFaceModel,
	HuggingFaceModelList,
} from '$/sources/HuggingFace/Rest/types.ts'

const getJson = async <_Result>({
	binding,
	path,
	credential,
}: {
	binding: SourceBinding
	path: string
	credential?: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		...(credential != null && credential !== '' && {
			headers: {
				'authorization': `Bearer ${credential}`,
			},
		}),
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<_Result>()
}

export const listModels = ({
	binding,
	credential,
	search,
}: {
	binding: SourceBinding
	credential?: string
	search?: string
}) => getJson<HuggingFaceModelList>({
	binding,
	path: `/api/models${
		search == null || search === '' ?
			''
		:
			`?${new URLSearchParams({ search })}`
	}`,
	credential,
})

export const retrieveModel = ({
	binding,
	repoId,
	revision,
	credential,
}: {
	binding: SourceBinding
	repoId: string
	revision?: string
	credential?: string
}) => getJson<HuggingFaceModel>({
	binding,
	path: `/api/models/${repoId}${
		revision == null || revision === '' ?
			''
		:
			`?${new URLSearchParams({ revision })}`
	}`,
	credential,
})

export const retrieveFileText = ({
	binding,
	repoId,
	revision,
	path,
}: {
	binding: SourceBinding
	repoId: string
	revision: string
	path: string
}) => sourceGetText(
	binding,
	`https://huggingface.co/${repoId}/resolve/${revision}/${path}`
)
