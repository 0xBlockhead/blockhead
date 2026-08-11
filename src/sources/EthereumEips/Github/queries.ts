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

const assertProposalNumber = (number: number) => {
	if (!Number.isSafeInteger(number) || number < 1)
		throw new Error('EthereumEips_Github: proposal number must be a positive safe integer')
}

const assertProposalFileName = (
	ledger: EthereumEipSpecLedger,
	fileName: string
) => {
	if (!new RegExp(`^${ethereumEipSpecMarkdownPrefixByLedger[ledger]}-[1-9][0-9]*\\.md$`).test(fileName))
		throw new Error('EthereumEips_Github: invalid proposal Markdown filename')
}

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
	assertProposalFileName(ledger, fileName)
	const target = githubTargetForLedger(ledger)
	const rawUrl = githubRawUrl({
		...target,
		path: `${target.path}/${fileName}`,
	})
	if (downloadUrl != null && downloadUrl !== rawUrl)
		throw new Error('EthereumEips_Github: proposal download URL does not match its registered source target')

	return rawUrl
}

export const getProposalMarkdownUrl = ({
	ledger,
	number,
}: {
	ledger: EthereumEipSpecLedger
	number: number
}) => {
	assertProposalNumber(number)
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
	assertProposalNumber(number)
	const target = githubTargetForLedger(ledger)
	return `https://github.com/${target.owner}/${target.repo}/blob/${target.ref}/${target.path}/${ethereumEipSpecMarkdownPrefixByLedger[ledger]}-${number}.md`
}

export const getContents = async ({
	ledger,
}: {
	ledger: EthereumEipSpecLedger
}) => {
	const contents = await sourceGetJson<GithubContentsEntry[]>(bindingForLedger(ledger), getContentsUrl({ ledger }))
	const names = new Set<string>()
	for (const content of contents) {
		if (content.name === '')
			throw new Error('EthereumEips_Github: contents response contains an unnamed entry')
		if (names.has(content.name))
			throw new Error('EthereumEips_Github: contents response contains a duplicate entry name')
		names.add(content.name)
	}
	return contents
}

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
