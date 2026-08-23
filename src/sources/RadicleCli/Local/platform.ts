import { readRadicleRepository } from '$/sources/RadicleCli/Local/read.ts'
import type { RadicleCliPlatformAdapter, RadicleCliSession } from '$/sources/RadicleCli/Local/types.ts'

export const radicleCliPlatformAdapter: RadicleCliPlatformAdapter | undefined = undefined

export const createRadicleCliSession = (
	adapter: RadicleCliPlatformAdapter | undefined = radicleCliPlatformAdapter
): RadicleCliSession => ({
	readRepository: async (repositoryId) => {
		if (adapter == null)
			throw new Error('RadicleCli_Local: local radicle CLI authority is unavailable')
		return readRadicleRepository(repositoryId, adapter)
	},
})
