import { query } from '$app/server'

import { fetchRegistry } from '$/sources/Acp/Rest/queries.ts'

export const fetchRegistryRemote = query(() => fetchRegistry())
