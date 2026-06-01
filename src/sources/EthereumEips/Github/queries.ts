import { getJson, getText } from '$/sources/Github/Rest/client.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import EthereumEips from '$/sources/EthereumEips/index.ts'

import {
	ethereumEipSpecGithubRepoByLedger,
	ethereumEipSpecMarkdownPrefixByLedger,
} from './constants.ts'
import type { EthereumEipSpecLedger } from './types.ts'

export const getContentsUrl = ({ ledger }: { ledger: EthereumEipSpecLedger }) => {
	const repository = ethereumEipSpecGithubRepoByLedger[ledger]
	return getRestRepoContentsUrl({
		owner: repository.owner,
		repo: repository.repo,
		pathInRepo: repository.path,
		ref: repository.ref,
	})
}

export const getRawMarkdownUrl = ({
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
		getRawUserContentUrl({
			owner: repository.owner,
			repo: repository.repo,
			ref: repository.ref,
			pathInRepo: `${repository.path}/${fileName}`,
		})
	)
}

export const getProposalMarkdownUrl = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => {
	const repository = ethereumEipSpecGithubRepoByLedger[ledger]
	return getRawUserContentUrl({
		owner: repository.owner,
		repo: repository.repo,
		ref: repository.ref,
		pathInRepo: (
			`${repository.path}/${ethereumEipSpecMarkdownPrefixByLedger[ledger]}-${number}.md`
		),
	})
}

export const getContents = ({ ledger }: { ledger: EthereumEipSpecLedger }) => (
	getJson<{
		type: string
		name: string
	}[]>({
		url: getContentsUrl({ ledger }),
		origins: EthereumEips.origins ?? [],
	})
)

export const getRawMarkdownText = ({
	ledger,
	fileName,
	downloadUrl,
}: {
	ledger: EthereumEipSpecLedger
	fileName: string
	downloadUrl: string | null | undefined
}) => getText({
	url: getRawMarkdownUrl({ ledger, fileName, downloadUrl }),
	origins: EthereumEips.origins ?? [],
})

export const getProposalMarkdownText = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => getText({
	url: getProposalMarkdownUrl({ ledger, number }),
	origins: EthereumEips.origins ?? [],
})
