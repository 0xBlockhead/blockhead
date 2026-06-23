import { getJson } from '$/lib/http.ts'
import { acpBindings } from '$/sources/Acp/bindings.ts'
import type { AcpRegistry } from '$/sources/Acp/Rest/types.ts'

const acpRegistryEndpoints = acpBindings[1].endpoints

const acpRegistryOrigins = acpRegistryEndpoints.flatMap((endpoint) => (
	[{
		origin: endpoint.origin,
		corsEnabled: endpoint.corsEnabled,
	}]
))

export const fetchRegistry = () => {
	const endpoint = acpRegistryEndpoints[0]
	return getJson<AcpRegistry>(endpoint.locator, {
		origins: acpRegistryOrigins,
	})
}
