import { readGitRepository } from '$/sources/Git/Local/read.ts'
import type { GitLocalPlatformAdapter, GitLocalSession } from '$/sources/Git/Local/types.ts'

export const gitLocalPlatformAdapter: GitLocalPlatformAdapter | undefined = undefined

export const createGitLocalSession = (
	adapter: GitLocalPlatformAdapter | undefined = gitLocalPlatformAdapter
): GitLocalSession => ({
	readRepository: async (repositoryId) => {
		if (adapter == null)
			throw new Error('Git_Local: local Git authority is unavailable')
		return readGitRepository(repositoryId, adapter)
	},
})
