import { getJson } from '$/lib/http.ts'
import {
	acpRegistryEndpoints,
	acpRegistryOrigins,
} from '$/sources/Acp/Rest/constants.ts'
import type { AcpRegistry } from '$/sources/Acp/Rest/types.ts'

export const fetchRegistry = () => {
	const endpoint = acpRegistryEndpoints[0]
	return getJson<AcpRegistry>(endpoint.locator, {
		origins: acpRegistryOrigins,
	})
}
