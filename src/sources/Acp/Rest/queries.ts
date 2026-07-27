import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Acp/bindings.ts'
import type { AcpRegistry } from '$/sources/Acp/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.AcpLocal_JsonRpc]

export const fetchRegistry = () => (
	sourceGetJson<AcpRegistry>(
		binding,
		firstHttpUrlForBinding(binding)
	)
)
