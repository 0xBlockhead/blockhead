import {
	firstHttpUrlForBinding,
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/BitcoinCashChips/bindings.ts'
import type { BitcoinCashChipsGitlabTree } from '$/sources/BitcoinCashChips/Gitlab/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.BitcoinCashChips_Gitlab]

const bitcoinCashChipsGitlabRepo = {
	projectId: '23431309',
	ref: 'master',
}

const gitlabProjectUrl = (path: string) => (
	`${firstHttpUrlForBinding(binding)}/api/v4/projects/${bitcoinCashChipsGitlabRepo.projectId}${path}`
)

export const getTree = () => (
	sourceGetJson<BitcoinCashChipsGitlabTree>(
		binding,
		gitlabProjectUrl(
			`/repository/tree?ref=${bitcoinCashChipsGitlabRepo.ref}&per_page=100`
		)
	)
)

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
