import bindings from '$/sources/SolanaSimds/bindings.ts'
import type { SolanaSimdContentEntry } from '$/sources/SolanaSimds/Github/types.ts'
import {
	githubContentsUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.SolanaSimds_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getProposalContents = () => (
	sourceGetJson<SolanaSimdContentEntry[]>(binding, githubContentsUrl(target))
)

export const getProposalMarkdownText = async ({
	number,
}: {
	number: number
}) => {
	if (!Number.isSafeInteger(number) || number < 0)
		throw new Error(`SolanaSimds_Github: invalid proposal number ${number}`)

	const entries = (await getProposalContents()).filter((contentEntry) => (
		contentEntry.type === 'file'
		&& contentEntry.name.startsWith(`${number.toString().padStart(4, '0')}-`)
		&& contentEntry.name.endsWith('.md')
	))
	if (entries.length === 0)
		throw new Error(`SolanaSimds_Github: proposal ${number} not found`)
	if (entries.length > 1)
		throw new Error(`SolanaSimds_Github: proposal ${number} has duplicate files`)

	const downloadUrl = entries[0]?.download_url
	if (downloadUrl == null)
		throw new Error(`SolanaSimds_Github: proposal ${number} has no download URL`)

	return sourceGetText(binding, downloadUrl)
}
