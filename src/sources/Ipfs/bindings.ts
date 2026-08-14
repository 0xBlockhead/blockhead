import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.Ipfs_Rest,
		target: {
			kind: SourceTargetKind.ContentAddressScheme,
			key: 'ipfs',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ipfs.io',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://dweb.link',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.IpfsGateway,
		operationGroups: [
			SourceOperationGroup.ContentGatewayRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
	},
])
