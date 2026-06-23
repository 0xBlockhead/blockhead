import { getJson, getText } from '$/lib/http.ts'
import type { SourceEndpoint } from '$/sources/SourceBinding.ts'
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
	endpoints,
	target,
}: {
	endpoints: readonly SourceEndpoint[]
	target: GithubRepositoryTarget
}): Promise<GithubContentsEntry[]> => (
	getJson<GithubContentsEntry[]>(githubContentsUrl(target), {
		origins: endpoints.flatMap((endpoint) => (
			endpoint.origin == null ?
				[]
			:
				[{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled === true,
				}]
		)),
	})
)

export const getGithubRawText = ({
	endpoints,
	target,
}: {
	endpoints: readonly SourceEndpoint[]
	target: GithubRepositoryTarget
}): Promise<string> => (
	getText(githubRawUrl(target), {
		origins: endpoints.flatMap((endpoint) => (
			endpoint.origin == null ?
				[]
			:
				[{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled === true,
				}]
		)),
	})
)
