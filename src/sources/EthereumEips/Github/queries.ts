import {
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import type { GithubContentsEntry } from '$/sources/_shared/hosts/Github/Http/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceGetJson, sourceGetText } from '$/sources/_runtime/http.ts'
import {
	ethereumEipSpecGithubRepoByLedger,
	ethereumEipSpecMarkdownPrefixByLedger,
} from '$/sources/EthereumEips/Github/constants.ts'
import type { EthereumEipSpecLedger } from '$/sources/EthereumEips/Github/types.ts'

const githubTargetForLedger = (ledger: EthereumEipSpecLedger) => (
	ethereumEipSpecGithubRepoByLedger[ledger]
)

export const getContentsUrl = ({ ledger }: { ledger: EthereumEipSpecLedger }) => (
	githubContentsUrl({
		...githubTargetForLedger(ledger),
	})
)

export const getRawMarkdownUrl = ({
	ledger,
	fileName,
	downloadUrl,
}: {
	ledger: EthereumEipSpecLedger
	fileName: string
	downloadUrl: string | null | undefined
}) => {
	const target = githubTargetForLedger(ledger)
	return (
		downloadUrl ??
		githubRawUrl({
			...target,
			path: `${target.path}/${fileName}`,
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
	const target = githubTargetForLedger(ledger)
	return githubRawUrl({
		...target,
		path: `${target.path}/${ethereumEipSpecMarkdownPrefixByLedger[ledger]}-${number}.md`,
	})
}

export const getContents = ({
	binding,
	ledger,
}: {
	binding: SourceBinding
	ledger: EthereumEipSpecLedger
}) => (
	sourceGetJson<GithubContentsEntry[]>(binding, getContentsUrl({ ledger }))
)

export const getRawMarkdownText = ({
	ledger,
	fileName,
	downloadUrl,
	binding,
}: {
	ledger: EthereumEipSpecLedger
	fileName: string
	downloadUrl: string | null | undefined
	binding: SourceBinding
}) => (
	sourceGetText(binding, getRawMarkdownUrl({
		ledger,
		fileName,
		downloadUrl,
	}))
)

export const getProposalMarkdownText = ({
	ledger,
	number,
	binding,
}: {
	ledger: EthereumEipSpecLedger
	number: number
	binding: SourceBinding
}) => {
	return sourceGetText(binding, getProposalMarkdownUrl({
		ledger,
		number,
	}))
}
