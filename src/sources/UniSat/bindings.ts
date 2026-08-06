import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'


/**
 * UniSat OpenAPI indexer (inscriptions + runes).
 * @see https://docs.unisat.io/developer-support/open-api-documentation.md
 * @see https://docs.unisat.io/developer-support/open-api-documentation/api-for-bitcoin/general/inscriptions/get-inscription-info.md
 * @see https://docs.unisat.io/developer-support/open-api-documentation/api-for-bitcoin/runes/get-runes-info.md
 */
export default indexSourceBindings([
	{
		source: Source.UniSat_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'bip122:000000000019d6689c085ae165831e93',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://open-api.unisat.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_UNISAT_API_KEY': 'string > 0',
				}),
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/UniSat/Rest/types.ts',
				referenceUrl: 'https://docs.unisat.io/developer-support/open-api-documentation.md',
			},
		],
	},
])
