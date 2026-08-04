// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	mapSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const safeTransactionServiceRestBindingAxes = {
	source: Source.SafeTransactionService_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.HttpProxy,
	credentials: [
		{
			scope: SourceCredentialScope.RuntimeSecret,
		},
	],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/SafeTransactionService/Rest/types.ts',
		},
	],
} as const

export default indexSourceBindings(mapSourceBindings(
	[
		{
			key: '1',
			locator: 'https://api.safe.global/tx-service/eth',
		},
		{
			key: '10',
			locator: 'https://api.safe.global/tx-service/oeth',
		},
		{
			key: '50',
			locator: 'https://api.safe.global/tx-service/xdc',
		},
		{
			key: '56',
			locator: 'https://api.safe.global/tx-service/bnb',
		},
		{
			key: '100',
			locator: 'https://api.safe.global/tx-service/gno',
		},
		{
			key: '130',
			locator: 'https://api.safe.global/tx-service/unichain',
		},
		{
			key: '137',
			locator: 'https://api.safe.global/tx-service/pol',
		},
		{
			key: '143',
			locator: 'https://api.safe.global/tx-service/monad',
		},
		{
			key: '146',
			locator: 'https://api.safe.global/tx-service/sonic',
		},
		{
			key: '196',
			locator: 'https://api.safe.global/tx-service/okb',
		},
		{
			key: '204',
			locator: 'https://api.safe.global/tx-service/opbnb',
		},
		{
			key: '232',
			locator: 'https://api.safe.global/tx-service/lens',
		},
		{
			key: '324',
			locator: 'https://api.safe.global/tx-service/zksync',
		},
		{
			key: '480',
			locator: 'https://api.safe.global/tx-service/wc',
		},
		{
			key: '677',
			locator: 'https://api.safe.global/tx-service/bot',
		},
		{
			key: '988',
			locator: 'https://api.safe.global/tx-service/stable',
		},
		{
			key: '999',
			locator: 'https://api.safe.global/tx-service/hyper',
		},
		{
			key: '1001',
			locator: 'https://api.safe.global/tx-service/kairos',
		},
		{
			key: '1672',
			locator: 'https://api.safe.global/tx-service/pharos',
		},
		{
			key: '3338',
			locator: 'https://api.safe.global/tx-service/peaq',
		},
		{
			key: '4217',
			locator: 'https://api.safe.global/tx-service/tempo',
		},
		{
			key: '4326',
			locator: 'https://api.safe.global/tx-service/mega',
		},
		{
			key: '4663',
			locator: 'https://api.safe.global/tx-service/robinhood',
		},
		{
			key: '5000',
			locator: 'https://api.safe.global/tx-service/mantle',
		},
		{
			key: '5003',
			locator: 'https://api.safe.global/tx-service/mnt-sep',
		},
		{
			key: '5042',
			locator: 'https://api.safe.global/tx-service/arc',
		},
		{
			key: '8217',
			locator: 'https://api.safe.global/tx-service/kaia',
		},
		{
			key: '8453',
			locator: 'https://api.safe.global/tx-service/base',
		},
		{
			key: '9745',
			locator: 'https://api.safe.global/tx-service/plasma',
		},
		{
			key: '10143',
			locator: 'https://api.safe.global/tx-service/monad-testnet',
		},
		{
			key: '10200',
			locator: 'https://api.safe.global/tx-service/chi',
		},
		{
			key: '16661',
			locator: 'https://api.safe.global/tx-service/0g',
		},
		{
			key: '25363',
			locator: 'https://api.safe.global/tx-service/fluent',
		},
		{
			key: '42161',
			locator: 'https://api.safe.global/tx-service/arb1',
		},
		{
			key: '42220',
			locator: 'https://api.safe.global/tx-service/celo',
		},
		{
			key: '42431',
			locator: 'https://api.safe.global/tx-service/tempo-moderato',
		},
		{
			key: '43111',
			locator: 'https://api.safe.global/tx-service/hemi',
		},
		{
			key: '43114',
			locator: 'https://api.safe.global/tx-service/avax',
		},
		{
			key: '46630',
			locator: 'https://api.safe.global/tx-service/robinhood-testnet',
		},
		{
			key: '57073',
			locator: 'https://api.safe.global/tx-service/ink',
		},
		{
			key: '59144',
			locator: 'https://api.safe.global/tx-service/linea',
		},
		{
			key: '80069',
			locator: 'https://api.safe.global/tx-service/bep',
		},
		{
			key: '80094',
			locator: 'https://api.safe.global/tx-service/berachain',
		},
		{
			key: '81224',
			locator: 'https://api.safe.global/tx-service/codex',
		},
		{
			key: '84532',
			locator: 'https://api.safe.global/tx-service/basesep',
		},
		{
			key: '102030',
			locator: 'https://api.safe.global/tx-service/ctc',
		},
		{
			key: '534352',
			locator: 'https://api.safe.global/tx-service/scr',
		},
		{
			key: '747474',
			locator: 'https://api.safe.global/tx-service/katana',
		},
		{
			key: '5042002',
			locator: 'https://api.safe.global/tx-service/arc-testnet',
		},
		{
			key: '11142220',
			locator: 'https://api.safe.global/tx-service/celo-sep',
		},
		{
			key: '11155111',
			locator: 'https://api.safe.global/tx-service/sep',
		},
		{
			key: '1313161554',
			locator: 'https://api.safe.global/tx-service/aurora',
		},
	] as const,
	({
		key,
		locator,
	}) => ({
		...safeTransactionServiceRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator,
				corsEnabled: false,
			},
		],
	})
))
