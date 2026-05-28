import { getJson, getText } from '$/sources/Github/Rest/client.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import EthereumEips from '$/sources/EthereumEips/index.ts'

import {
	ethereumEipSpecGithubRepoByLedger,
	ethereumEipSpecMarkdownPrefixByLedger,
} from './constants.ts'
import type { EthereumEipSpecLedger } from './types.ts'

export const getEthereumEipSpecGithubContentsUrl = ({ ledger }: { ledger: EthereumEipSpecLedger }) => {
	const repository = ethereumEipSpecGithubRepoByLedger[ledger]
	return getGithubRestRepoContentsUrl({
		owner: repository.owner,
		repo: repository.repo,
		pathInRepo: repository.path,
		ref: repository.ref,
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
	const repository = ethereumEipSpecGithubRepoByLedger[ledger]
	return (
		downloadUrl ??
		getGithubRawUserContentUrl({
			owner: repository.owner,
			repo: repository.repo,
			ref: repository.ref,
			pathInRepo: `${repository.path}/${fileName}`,
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
	const repository = ethereumEipSpecGithubRepoByLedger[ledger]
	return getGithubRawUserContentUrl({
		owner: repository.owner,
		repo: repository.repo,
		ref: repository.ref,
		pathInRepo: (
			`${repository.path}/${ethereumEipSpecMarkdownPrefixByLedger[ledger]}-${number}.md`
		),
	})
}

export const getEthereumEipSpecGithubContents = ({ ledger }: { ledger: EthereumEipSpecLedger }) => (
	getJson<{
		type: string
		name: string
	}[]>({
		url: getEthereumEipSpecGithubContentsUrl({ ledger }),
		origins: EthereumEips.origins ?? [],
	})
)

export const getEthereumEipSpecRawMarkdownText = ({
	ledger,
	fileName,
	downloadUrl,
}: {
	ledger: EthereumEipSpecLedger
	fileName: string
	downloadUrl: string | null | undefined
}) => getText({
	url: getEthereumEipSpecRawMarkdownUrl({ ledger, fileName, downloadUrl }),
	origins: EthereumEips.origins ?? [],
})

export const getEthereumEipSpecProposalMarkdownText = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => getText({
	url: getEthereumEipSpecProposalMarkdownUrl({ ledger, number }),
	origins: EthereumEips.origins ?? [],
})
