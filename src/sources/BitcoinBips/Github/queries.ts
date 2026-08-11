import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/BitcoinBips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.BitcoinBips_Github][0]

const assertProposalNumber = (number: number) => {
	if (!Number.isSafeInteger(number) || number < 0)
		throw new Error('BitcoinBips_Github: proposal number must be a non-negative safe integer')
}

export const getContents = () => (
	getGithubContents({
		binding,
		target: githubRepositoryTargetFromKey(binding.target.key),
	})
)

export const getProposalFiles = async () => (
	[...Map.groupBy(
		(await getContents()).flatMap((content) => {
			const proposalNumberRaw = /^bip-(?<proposalNumber>\d{4})\.(?:md|mediawiki)$/.exec(content.name)?.groups?.proposalNumber
			return proposalNumberRaw == null ?
				[]
			:
				[{
					content,
					number: parseInt(proposalNumberRaw, 10),
				}]
		}),
		({ number }) => number
	)]
		.toSorted(([leftNumber], [rightNumber]) => leftNumber - rightNumber)
		.map(([number, proposals]) => {
			if (proposals.length !== 1)
				throw new Error(`BitcoinBips_Github: duplicate proposal files for BIP ${number}: ${proposals.map(({ content }) => content.name).sort().join(', ')}`)

			const [{ content }] = proposals
			if (content.type !== 'file')
				throw new Error(`BitcoinBips_Github: proposal path is not a file for BIP ${number}: ${content.name}`)

			return {
				number,
				path: content.path,
			}
		})
)

export const getProposalText = async ({
	number,
}: {
	number: number
}) => {
	assertProposalNumber(number)
	const proposal = (await getProposalFiles()).find((candidate) => candidate.number === number)
	if (proposal == null)
		throw new Error(`BitcoinBips_Github: proposal not found ${number.toString()}`)

	return getGithubRawText({
		binding,
		target: {
			...githubRepositoryTargetFromKey(binding.target.key),
			path: proposal.path,
		},
	})
}
