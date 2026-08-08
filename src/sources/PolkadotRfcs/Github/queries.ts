import bindings from '$/sources/PolkadotRfcs/bindings.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = Object.fromEntries(bindings[Source.PolkadotRfcs_Github].map((binding) => [binding.target.key, binding]))['polkadot-fellows/RFCs@main:text']
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getMarkdownText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...target,
			path: `${target.path}/${number.toString().padStart(4, '0')}.md`,
		},
	})
)
