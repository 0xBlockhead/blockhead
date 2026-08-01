// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.QuilibriumNodeMetrics_Prometheus,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'quilibrium-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:QUILIBRIUM_NODE_PROMETHEUS_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Prometheus,
		apiFamily: ApiFamily.PrometheusText,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
