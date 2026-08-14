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

const assertTreePath = (path: string) => {
	const segments = path.split('/')
	if (
		segments.length === 0
		|| segments.some((segment) => (
			segment === ''
			|| segment === '.'
			|| segment === '..'
			|| /[\u0000-\u001f\u007f]/.test(segment)
		))
	)
		throw new Error('BitcoinCashChips_Gitlab: invalid repository tree path')
}

export const getTree = async () => {
	const entries: BitcoinCashChipsGitlabTree = []
	const paths = new Set<string>()

	for (let page = 1; ; page += 1) {
		const perPage = 100
		const tree = await sourceGetJson<BitcoinCashChipsGitlabTree>(
			binding,
			gitlabProjectUrl(
				`/repository/tree?ref=${bitcoinCashChipsGitlabRepo.ref}&page=${page}&per_page=${perPage}`
			)
		)
		let treePage: BitcoinCashChipsGitlabTree
		try {
			treePage = bitcoinCashChipsGitlabTreeWire.assert(tree)
		} catch {
			throw new Error('BitcoinCashChips_Gitlab: invalid repository tree response')
		}

		for (const entry of treePage) {
			assertTreePath(entry.path)
			if (entry.path.split('/').at(-1) !== entry.name)
				throw new Error('BitcoinCashChips_Gitlab: repository tree name does not match path')
			if (paths.has(entry.path))
				throw new Error('BitcoinCashChips_Gitlab: duplicate repository tree path')
			paths.add(entry.path)
			entries.push(entry)
		}

		if (treePage.length < perPage)
			return entries
	}
}

export const getChipMarkdownText = (
	{ path }: { path: string }
) => {
	assertTreePath(path)
	return sourceGetText(
		binding,
		gitlabProjectUrl(
			`/repository/files/${encodeURIComponent(path)}/raw?ref=${bitcoinCashChipsGitlabRepo.ref}`
		)
	)
}
