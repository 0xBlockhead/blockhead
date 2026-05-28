import { getJson, getText } from '$/lib/http.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import SolanaSimds from '$/sources/SolanaSimds/index.ts'
import type { SolanaSimdContentEntry } from '$/sources/SolanaSimds/Github/types.ts'

const owner = 'solana-foundation'
const repo = 'solana-improvement-documents'
const ref = 'main'

export const getSimdProposalContents = () => (
	getJson<SolanaSimdContentEntry[]>(
		getGithubRestRepoContentsUrl({
			owner,
			repo,
			pathInRepo: 'proposals',
			ref,
		}),
		{ origins: SolanaSimds.origins ?? [] },
	)
)

export const getSimdProposalMarkdownText = ({ number }: { number: number }) => (
	getText(
		getGithubRawUserContentUrl({
			owner,
			repo,
			ref,
			pathInRepo: `proposals/${number.toString().padStart(4, '0')}-simd-process.md`,
		}),
		{ origins: SolanaSimds.origins ?? [] },
	).catch(() => (
		getSimdProposalContents()
			.then((entries) => {
				const entry = entries.find((contentEntry) => (
					contentEntry.type === 'file'
					&& contentEntry.name.startsWith(`${number.toString().padStart(4, '0')}-`)
				))
				if (entry?.download_url == null) {
					throw new Error(`SolanaSimds_Github: proposal ${number} not found`)
				}
				return getText(entry.download_url, { origins: SolanaSimds.origins ?? [] })
			})
	))
)
