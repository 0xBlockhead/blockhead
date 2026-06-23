import { Source } from '$/sources/Source.ts'
import { getText } from '$/lib/http.ts'
import {
	ApiFamily,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { ethereumEipsBindings } from '$/sources/EthereumEips/bindings.ts'

import {
	ethereumEipSpecGithubRepoByLedger,
	ethereumEipSpecMarkdownPrefixByLedger,
} from './constants.ts'
import type { EthereumEipSpecLedger } from './types.ts'

const ethereumEipsBindingByTargetKey = Object.fromEntries(
	ethereumEipsBindings
		.filter((binding) => (
			binding.source === Source.EthereumEips_Github
			&& binding.apiFamily === ApiFamily.GithubContentsApi
			&& binding.target.kind === SourceTargetKind.GitRepository
		))
		.map((binding) => [
			binding.target.key,
			binding,
		])
)

const githubTargetForLedger = (ledger: EthereumEipSpecLedger) => (
	ethereumEipSpecGithubRepoByLedger[ledger]
)

const bindingForLedger = (ledger: EthereumEipSpecLedger) => {
	const target = githubTargetForLedger(ledger)
	return ethereumEipsBindingByTargetKey[`${target.owner}/${target.repo}@${target.ref}:${target.path}`]
}

const originsForLedger = (ledger: EthereumEipSpecLedger) => (
	bindingForLedger(ledger).endpoints.flatMap((endpoint) => (
		[{
			origin: endpoint.origin,
			corsEnabled: endpoint.corsEnabled,
		}]
	))
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

export const getContents = ({ ledger }: { ledger: EthereumEipSpecLedger }) => (
	getGithubContents({
		endpoints: bindingForLedger(ledger).endpoints,
		target: githubTargetForLedger(ledger),
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
}) => (
	downloadUrl == null ?
		getGithubRawText({
			endpoints: bindingForLedger(ledger).endpoints,
			target: {
				...githubTargetForLedger(ledger),
				path: `${githubTargetForLedger(ledger).path}/${fileName}`,
			},
		})
	:
		getText(downloadUrl, {
			origins: originsForLedger(ledger),
		})
)

export const getProposalMarkdownText = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => {
	const target = githubTargetForLedger(ledger)
	return getGithubRawText({
		endpoints: bindingForLedger(ledger).endpoints,
		target: {
			...target,
			path: `${target.path}/${ethereumEipSpecMarkdownPrefixByLedger[ledger]}-${number}.md`,
		},
	})
}
