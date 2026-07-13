import { getText } from '$/lib/http.ts'
import type { SolanaSimdContentEntry } from '$/sources/SolanaSimds/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

const solanaSimdsGithubRepo = {
	owner: 'solana-foundation',
	repo: 'solana-improvement-documents',
	path: 'proposals',
	ref: 'main',
} as const

const origins = githubHttpEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

export const getProposalContents = (): Promise<SolanaSimdContentEntry[]> => (
	getGithubContents({
		endpoints: githubHttpEndpoints,
		target: solanaSimdsGithubRepo,
	})
)

export const getProposalMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: githubHttpEndpoints,
		target: {
			...solanaSimdsGithubRepo,
			path: `proposals/${number.toString().padStart(4, '0')}-simd-process.md`,
		},
	}).catch(() => (
		getProposalContents()
			.then((entries) => {
				const entry = entries.find((contentEntry) => (
					contentEntry.type === 'file'
					&& contentEntry.name.startsWith(`${number.toString().padStart(4, '0')}-`)
				))
				if (entry?.download_url == null)
					throw new Error(`SolanaSimds_Github: proposal ${number} not found`)

				return getText(entry.download_url, { origins })
			})
	))
)
