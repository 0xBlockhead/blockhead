import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	acpRegistryWire,
	type AcpRegistry,
} from '$/sources/Acp/Rest/types.ts'

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`AcpRegistry_Rest: invalid ${label} response envelope`)
	}
}

export const fetchRegistry = async (binding: SourceBinding): Promise<AcpRegistry> => (
	assertEnvelope(
		'registry',
		acpRegistryWire,
		await sourceGetJson(
			binding,
			firstHttpUrlForBinding(binding)
		)
	)
)
