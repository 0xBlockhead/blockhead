import { query } from '$app/server'
import { type } from 'arktype'

import bindings from '$/sources/Mcp/bindings.ts'
import { getRegistryServer } from '$/sources/Mcp/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

export const getRegistryServerRemote = query(
	type({
		registryServerName: 'string',
		version: 'string',
	}),
	({ registryServerName, version }) => getRegistryServer(
		bindings[Source.McpPackageRegistry_Rest][0],
		registryServerName,
		version
	)
)
