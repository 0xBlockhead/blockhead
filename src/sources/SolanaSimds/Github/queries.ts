import { fetchFailedMessage } from '$/lib/http.ts'
import bindings from '$/sources/SolanaSimds/bindings.ts'
import type { SolanaSimdContentEntry } from '$/sources/SolanaSimds/Github/types.ts'
import {
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	sourceFetch,
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import { regex } from 'arkregex'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.SolanaSimds_Github]

const githubRepositoryTarget = regex('^(?<owner>[^/]+)/(?<repo>[^@]+)@(?<ref>[^:]+):(?<path>.*)$')

export const getProposalContents = (): Promise<SolanaSimdContentEntry[]> => {
	const target = githubRepositoryTarget.exec(binding.target.key)?.groups
	if (target == null)
		throw new Error('SolanaSimds_Github: source binding has an invalid Git repository target')

	return sourceGetJson<SolanaSimdContentEntry[]>(binding, githubContentsUrl(target))
}

export const getProposalMarkdownText = async ({
	number,
}: {
	number: number
}) => {
	const target = githubRepositoryTarget.exec(binding.target.key)?.groups
	if (target == null)
		throw new Error('SolanaSimds_Github: source binding has an invalid Git repository target')

	const proposalUrl = githubRawUrl({
		...target,
		path: `${target.path}/${number.toString().padStart(4, '0')}-simd-process.md`,
	})
	const response = await sourceFetch(binding, proposalUrl)
	if (response.ok)
		return response.text()
	if (response.status !== 404)
		throw new Error(await fetchFailedMessage(proposalUrl, response))

	const entry = (await getProposalContents()).find((contentEntry) => (
		contentEntry.type === 'file'
		&& contentEntry.name.startsWith(`${number.toString().padStart(4, '0')}-`)
	))
	if (entry?.download_url == null)
		throw new Error(`SolanaSimds_Github: proposal ${number} not found`)

	return sourceGetText(binding, entry.download_url)
}
