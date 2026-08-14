import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/ZcashZips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.ZcashZips_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

const assertZipNumber = (number: number) => {
	if (!Number.isSafeInteger(number) || number < 1)
		throw new Error('ZcashZips_Github: ZIP number must be a positive safe integer')
}

export const getContentsUrl = () => (
	githubContentsUrl(target)
)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getProposalFiles = async () => (
	[...Map.groupBy(
		(await getContents()).flatMap((content) => {
			const proposalNumberRaw = /^zip-(?<proposalNumber>\d{4})\.rst$/.exec(content.name)?.groups?.proposalNumber
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
				throw new Error(`ZcashZips_Github: duplicate proposal files for ZIP ${number}: ${proposals.map(({ content }) => content.name).sort().join(', ')}`)

			const [{ content }] = proposals
			if (content.type !== 'file')
				throw new Error(`ZcashZips_Github: proposal path is not a file for ZIP ${number}: ${content.name}`)

			return {
				number,
				path: content.path,
			}
		})
)

export const getProposalRstText = async ({
	number,
}: {
	number: number
}) => {
	assertZipNumber(number)
	const proposal = (await getProposalFiles()).find((candidate) => candidate.number === number)
	if (proposal == null)
		throw new Error(`ZcashZips_Github: proposal not found ${number.toString()}`)

	return getGithubRawText({
		binding,
		target: {
			...target,
			path: proposal.path,
		},
	})
}
