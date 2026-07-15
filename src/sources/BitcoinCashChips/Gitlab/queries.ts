import { getJson, getText } from '$/lib/http.ts'
import type { BitcoinCashChipsGitlabTree } from '$/sources/BitcoinCashChips/Gitlab/types.ts'
import { gitlabHttpEndpoints } from '$/sources/_shared/hosts/Gitlab/Http/constants.ts'

const bitcoinCashChipsGitlabRepo = {
	projectId: '23431309',
	ref: 'master',
} as const

const origins = gitlabHttpEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

const gitlabProjectUrl = (path: string) => (
	`https://gitlab.com/api/v4/projects/${bitcoinCashChipsGitlabRepo.projectId}${path}`
)

export const getTree = () => (
	getJson<BitcoinCashChipsGitlabTree>(
		gitlabProjectUrl(`/repository/tree?ref=${bitcoinCashChipsGitlabRepo.ref}&per_page=100`),
		{ origins }
	)
)

export const getChipMarkdownText = ({ path }: { path: string }) => (
	getText(
		gitlabProjectUrl(`/repository/files/${encodeURIComponent(path)}/raw?ref=${bitcoinCashChipsGitlabRepo.ref}`),
		{ origins }
	)
)
