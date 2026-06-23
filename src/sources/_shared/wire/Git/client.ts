import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	GitObjectRequest,
	GitRepositoryLocator,
} from '$/sources/_shared/wire/Git/types.ts'

export const gitRepositoryLocator = (
	binding: SourceBinding,
	repository: GitRepositoryLocator
) => ({
	binding,
	repository,
})

export const gitObjectRequest = (
	binding: SourceBinding,
	request: GitObjectRequest
) => ({
	binding,
	request,
})
