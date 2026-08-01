import {
	githubContentsUrl,
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import type { GithubContentsEntry } from '$/sources/_shared/hosts/Github/Http/types.ts'
import bindings from '$/sources/EthereumEips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson, sourceGetText } from '$/sources/_runtime/http.ts'
import {
	ethereumEipSpecMarkdownPrefixByLedger,
} from '$/sources/EthereumEips/Github/constants.ts'
import type { EthereumEipSpecLedger } from '$/sources/EthereumEips/Github/types.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.EthereumEips_Github].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)
const bindingByLedger = {
	eip: bindingByTargetKey['ethereum/EIPs@master:EIPS'],
	erc: bindingByTargetKey['ethereum/ercs@master:ERCS'],
} as const satisfies Record<EthereumEipSpecLedger, unknown>
const targetByLedger = Object.fromEntries(
	Object.entries(bindingByLedger).map(([ledger, binding]) => ([
		ledger,
		githubRepositoryTargetFromKey(binding.target.key),
	] as const))
)

const githubTargetForLedger = (ledger: EthereumEipSpecLedger) => (
	targetByLedger[ledger]
)

const bindingForLedger = (ledger: EthereumEipSpecLedger) => bindingByLedger[ledger]

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

export const getProposalMarkdownPageUrl = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => {
	const target = githubTargetForLedger(ledger)
	return `https://github.com/${target.owner}/${target.repo}/blob/${target.ref}/${target.path}/${ethereumEipSpecMarkdownPrefixByLedger[ledger]}-${number}.md`
}

export const getContents = ({
	ledger,
}: {
	ledger: EthereumEipSpecLedger
}) => (
	sourceGetJson<GithubContentsEntry[]>(bindingForLedger(ledger), getContentsUrl({ ledger }))
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
	sourceGetText(bindingForLedger(ledger), getRawMarkdownUrl({
		ledger,
		fileName,
		downloadUrl,
	}))
)

export const getProposalMarkdownText = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => {
	return sourceGetText(bindingForLedger(ledger), getProposalMarkdownUrl({
		ledger,
		number,
	}))
}
