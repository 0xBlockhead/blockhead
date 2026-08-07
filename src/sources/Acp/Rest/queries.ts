import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Acp/bindings.ts'
import {
	acpRegistryWire,
	type AcpRegistry,
} from '$/sources/Acp/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.AcpRegistry_Rest][0]

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

export const fetchRegistry = async (): Promise<AcpRegistry> => (
	assertEnvelope(
		'registry',
		acpRegistryWire,
		await sourceGetJson(
			binding,
			firstHttpUrlForBinding(binding)
		)
	)
)
