import { type } from 'arktype'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/BitcoinCashChips/bindings.ts'
import type { BitcoinCashChipsGitlabTree } from '$/sources/BitcoinCashChips/Gitlab/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.BitcoinCashChips_Gitlab][0]

const bitcoinCashChipsGitlabRepo = {
	projectId: '23431309',
	ref: 'master',
}

const bitcoinCashChipsGitlabTreeWire = type({
	type: 'string',
	name: 'string',
	path: 'string',
}).array()

const gitlabProjectUrl = (path: string) => (
	`${firstHttpUrlForBinding(binding)}/api/v4/projects/${bitcoinCashChipsGitlabRepo.projectId}${path}`
)

export const getTree = async () => {
	const tree = await sourceGetJson<BitcoinCashChipsGitlabTree>(
		binding,
		gitlabProjectUrl(
			`/repository/tree?ref=${bitcoinCashChipsGitlabRepo.ref}&per_page=100`
		)
	)

	try {
		return bitcoinCashChipsGitlabTreeWire.assert(tree)
	} catch {
		throw new Error('BitcoinCashChips_Gitlab: invalid repository tree response')
	}
}

export const getChipMarkdownText = (
	{ path }: { path: string }
) => (
	sourceGetText(
		binding,
		gitlabProjectUrl(
			`/repository/files/${encodeURIComponent(path)}/raw?ref=${bitcoinCashChipsGitlabRepo.ref}`
		)
	)
)
