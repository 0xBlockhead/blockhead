import { getJson, getText } from '$/lib/http.ts'
import BitcoinCashChips from '$/sources/BitcoinCashChips/index.ts'
import type { BitcoinCashChipsGitlabTree } from '$/sources/BitcoinCashChips/Gitlab/types.ts'

const bitcoinCashChipsGitlabRepo = {
	projectId: '23431309',
	ref: 'master',
} as const

const gitlabProjectUrl = (path: string) => (
	`https://gitlab.com/api/v4/projects/${bitcoinCashChipsGitlabRepo.projectId}${path}`
)

export const getBitcoinCashChipsGitlabTree = () => (
	getJson<BitcoinCashChipsGitlabTree>(
		gitlabProjectUrl(`/repository/tree?ref=${bitcoinCashChipsGitlabRepo.ref}&per_page=100`),
		{ origins: BitcoinCashChips.origins ?? [] },
	)
)

export const getBitcoinCashChipMarkdownText = ({ path }: { path: string }) => (
	getText(
		gitlabProjectUrl(`/repository/files/${encodeURIComponent(path)}/raw?ref=${bitcoinCashChipsGitlabRepo.ref}`),
		{ origins: BitcoinCashChips.origins ?? [] },
	)
)
