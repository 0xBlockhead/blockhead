import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	RadicleObjectRequest,
	RadicleRepositoryLocator,
} from '$/sources/Radicle/Git/types.ts'
import {
	gitObjectRequest,
	gitRepositoryLocator,
} from '$/sources/_shared/wire/Git/client.ts'

export const radicleRepositoryLocator = (
	binding: SourceBinding,
	repository: RadicleRepositoryLocator
) => (
	gitRepositoryLocator(binding, repository)
)

export const radicleObjectRequest = (
	binding: SourceBinding,
	request: RadicleObjectRequest
) => (
	gitObjectRequest(binding, request)
)
