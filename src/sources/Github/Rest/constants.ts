export const githubApiOrigin = 'https://api.github.com'

export const githubRawContentOrigin = 'https://raw.githubusercontent.com'

export const githubRestApiVersion = '2022-11-28'

export const githubRestHeaders = {
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': githubRestApiVersion,
} as const
