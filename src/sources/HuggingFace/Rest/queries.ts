import bindings from '$/sources/HuggingFace/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type {
	HuggingFaceModel,
	HuggingFaceModelList,
} from '$/sources/HuggingFace/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.HuggingFaceHub_Rest]

const requestHuggingFaceJson = async <_Result>({
	path,
	credential,
}: {
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
	credential,
	search,
}: {
	credential?: string
	search?: string
}) => requestHuggingFaceJson<HuggingFaceModelList>({
	path: `/api/models${
		search == null || search === '' ?
			''
		:
			`?${new URLSearchParams({ search })}`
	}`,
	credential,
})

export const retrieveModel = ({
	repoId,
	revision,
	credential,
}: {
	repoId: string
	revision?: string
	credential?: string
}) => requestHuggingFaceJson<HuggingFaceModel>({
	path: `/api/models/${repoId}${
		revision == null || revision === '' ?
			''
		:
			`?${new URLSearchParams({ revision })}`
	}`,
	credential,
})

export const retrieveFileText = ({
	repoId,
	revision,
	path,
}: {
	repoId: string
	revision: string
	path: string
}) => {
	return sourceGetText(
		binding,
		`https://huggingface.co/${repoId}/resolve/${revision}/${path}`
	)
}
