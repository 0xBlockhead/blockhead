import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	GitObjectRequest,
	GitRepositoryLocator,
} from '$/sources/_shared/wire/Git/types.ts'
import {
	gitObjectRequest,
	gitRepositoryLocator,
} from '$/sources/_shared/wire/Git/client.ts'

export const repositoryLocator = (
	binding: SourceBinding,
	repository: GitRepositoryLocator
) => (
	gitRepositoryLocator(binding, repository)
)

export const objectRequest = (
	binding: SourceBinding,
	request: GitObjectRequest
) => (
	gitObjectRequest(binding, request)
)
