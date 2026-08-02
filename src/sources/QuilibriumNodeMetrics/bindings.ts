// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[])
