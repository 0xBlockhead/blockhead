import {
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	GithubContentsEntry,
	GithubRepositoryTarget,
} from '$/sources/_shared/hosts/Github/Http/types.ts'

export const githubContentsUrl = ({
	owner,
	repo,
	ref,
	path,
}: GithubRepositoryTarget) => (
	`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`
)

export const githubRawUrl = ({
	owner,
	repo,
	ref,
	path,
}: GithubRepositoryTarget) => (
	`https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
)

export const githubRepositoryTargetFromKey = (key: string) => {
	const match = /^(?<owner>[^/]+)\/(?<repo>[^@]+)@(?<ref>[^:]+):(?<path>.*)$/.exec(key)
	const owner = match?.groups?.owner
	const repo = match?.groups?.repo
	const ref = match?.groups?.ref
	const path = match?.groups?.path
	if (owner == null || repo == null || ref == null || path == null)
		throw new Error(`Invalid GitHub repository target: ${key}`)

	return {
		owner,
		repo,
		ref,
		path,
	}
}

export const getGithubContents = ({
	binding,
	target,
}: {
	binding: SourceBinding
	target: GithubRepositoryTarget
}) => (
	sourceGetJson<GithubContentsEntry[]>(
		binding,
		githubContentsUrl(target)
	)
)

export const getGithubRawText = ({
	binding,
	target,
}: {
	binding: SourceBinding
	target: GithubRepositoryTarget
}) => (
	sourceGetText(
		binding,
		githubRawUrl(target)
	)
)
