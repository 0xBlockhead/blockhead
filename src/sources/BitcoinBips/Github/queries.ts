import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const getContents = (binding: SourceBinding) => (
	getGithubContents({
		binding,
		target: githubRepositoryTargetFromKey(binding.target.key),
	})
)

export const getProposalFiles = async (binding: SourceBinding) => (
	[...Map.groupBy(
		(await getContents(binding)).flatMap((content) => {
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
	binding,
	number,
}: {
	binding: SourceBinding
	number: number
}) => {
	const proposal = (await getProposalFiles(binding)).find((candidate) => candidate.number === number)
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
