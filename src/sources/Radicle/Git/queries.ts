import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	GitObjectRequest,
	GitRepositoryLocator,
} from '$/sources/_shared/wire/Git/types.ts'
import {
	gitObjectRequest,
	gitRepositoryLocator,
} from '$/sources/_shared/wire/Git/client.ts'

export const radicleRepositoryLocator = (
	binding: SourceBinding,
	repository: GitRepositoryLocator
) => (
	gitRepositoryLocator(binding, repository)
)

export const radicleObjectRequest = (
	binding: SourceBinding,
	request: GitObjectRequest
) => (
	gitObjectRequest(binding, request)
)
