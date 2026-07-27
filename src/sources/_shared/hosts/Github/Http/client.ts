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
}: GithubRepositoryTarget): string => (
	`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`
)

export const githubRawUrl = ({
	owner,
	repo,
	ref,
	path,
}: GithubRepositoryTarget): string => (
	`https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
)

export const getGithubContents = ({
	binding,
	target,
}: {
	binding: SourceBinding
	target: GithubRepositoryTarget
}): Promise<GithubContentsEntry[]> => (
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
}): Promise<string> => (
	sourceGetText(
		binding,
		githubRawUrl(target)
	)
)
