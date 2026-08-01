import { fetchFailedMessage } from '$/lib/http.ts'
import bindings from '$/sources/SolanaSimds/bindings.ts'
import type { SolanaSimdContentEntry } from '$/sources/SolanaSimds/Github/types.ts'
import {
	githubContentsUrl,
	githubRepositoryTargetFromKey,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	sourceFetch,
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.SolanaSimds_Github]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getProposalContents = () => (
	sourceGetJson<SolanaSimdContentEntry[]>(binding, githubContentsUrl(target))
)

export const getProposalMarkdownText = async ({
	number,
}: {
	number: number
}) => {
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
