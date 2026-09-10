import { createRadicleCliLocalResolverModule } from '$/resolvers/RadicleCli-Local.ts'
import { createRadicleCliSession } from '$/sources/RadicleCli/Local/platform.ts'
import { createRadicleCliRuntimeAdapter } from '$/sources/RadicleCli/Local/runtime.server.ts'
import type { RadicleCliPlatformAdapter } from '$/sources/RadicleCli/Local/types.ts'

export const createRadicleCliLocalServerResolverModule = (
	adapter: RadicleCliPlatformAdapter = createRadicleCliRuntimeAdapter(),
) => createRadicleCliLocalResolverModule(createRadicleCliSession(adapter))
