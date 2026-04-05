import { getJson, getText } from '$/sources/Github/Rest/client.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'

import {
	ethereumEipSpecGithubRepoByLedger,
	ethereumEipSpecMarkdownPrefixByLedger,
} from './constants.ts'
import type { EthereumEipSpecLedger } from './types.ts'

export { parseFrontmatter, stripFrontmatter } from '$/sources/Github/Rest/client.ts'

export const getEthereumEipSpecGithubContentsUrl = ({ ledger }: { ledger: EthereumEipSpecLedger }) => {
	const r = ethereumEipSpecGithubRepoByLedger[ledger]
	return getGithubRestRepoContentsUrl({
		owner: r.owner,
		repo: r.repo,
		pathInRepo: r.path,
		ref: r.ref,
	})
}

export const getEthereumEipSpecRawMarkdownUrl = ({
	ledger,
	fileName,
	downloadUrl,
}: {
	ledger: EthereumEipSpecLedger
	fileName: string
	downloadUrl: string | null | undefined
}) => {
	const r = ethereumEipSpecGithubRepoByLedger[ledger]
	return (
		downloadUrl ??
		getGithubRawUserContentUrl({
			owner: r.owner,
			repo: r.repo,
			ref: r.ref,
			pathInRepo: `${r.path}/${fileName}`,
		})
	)
}

export const getEthereumEipSpecProposalMarkdownUrl = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => {
	const r = ethereumEipSpecGithubRepoByLedger[ledger]
	return getGithubRawUserContentUrl({
		owner: r.owner,
		repo: r.repo,
		ref: r.ref,
		pathInRepo: (
			`${r.path}/${ethereumEipSpecMarkdownPrefixByLedger[ledger]}-${number}.md`
		),
	})
}

export const getEthereumEipSpecGithubContents = ({ ledger }: { ledger: EthereumEipSpecLedger }) => (
	getJson({ url: getEthereumEipSpecGithubContentsUrl({ ledger }) })
)

export const getEthereumEipSpecRawMarkdownText = ({
	ledger,
	fileName,
	downloadUrl,
}: {
	ledger: EthereumEipSpecLedger
	fileName: string
	downloadUrl: string | null | undefined
}) => getText({ url: getEthereumEipSpecRawMarkdownUrl({ ledger, fileName, downloadUrl }) })

export const getEthereumEipSpecProposalMarkdownText = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => getText({ url: getEthereumEipSpecProposalMarkdownUrl({ ledger, number }) })
