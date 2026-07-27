import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/FedimintGatewayd/bindings.ts'
import type { FedimintGatewaydJson } from '$/sources/FedimintGatewayd/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

export const query = (path: string) => (
	getJson<FedimintGatewaydJson>(bindings[Source.FedimintGatewayd_Rest], path)
)
