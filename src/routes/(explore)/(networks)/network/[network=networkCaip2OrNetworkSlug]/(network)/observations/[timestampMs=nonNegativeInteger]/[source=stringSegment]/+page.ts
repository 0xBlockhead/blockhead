// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import AvailNetwork_TimestampSchema from '$/schema/AvailNetwork_Timestamp.ts'
import BittensorNetwork_TimestampSchema from '$/schema/BittensorNetwork_Timestamp.ts'
import CardanoNetwork_TimestampSchema from '$/schema/CardanoNetwork_Timestamp.ts'
import CelestiaNetwork_TimestampSchema from '$/schema/CelestiaNetwork_Timestamp.ts'
import DydxChainNetwork_TimestampSchema from '$/schema/DydxChainNetwork_Timestamp.ts'
import { EntityType } from '$/schema/EntityType.ts'
import FilecoinNetwork_TimestampSchema from '$/schema/FilecoinNetwork_Timestamp.ts'
import HederaNetwork_TimestampSchema from '$/schema/HederaNetwork_Timestamp.ts'
import HyperliquidNetwork_TimestampSchema from '$/schema/HyperliquidNetwork_Timestamp.ts'
import IcpNetwork_TimestampSchema from '$/schema/IcpNetwork_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import KaspaNetwork_TimestampSchema from '$/schema/KaspaNetwork_Timestamp.ts'
import LightningNetwork_TimestampSchema from '$/schema/LightningNetwork_Timestamp.ts'
import LogosBlockchainNetwork_TimestampSchema from '$/schema/LogosBlockchainNetwork_Timestamp.ts'
import MoneroNetwork_TimestampSchema from '$/schema/MoneroNetwork_Timestamp.ts'
import StarknetNetwork_TimestampSchema from '$/schema/StarknetNetwork_Timestamp.ts'
import StellarNetwork_TimestampSchema from '$/schema/StellarNetwork_Timestamp.ts'
import SuiNetwork_TimestampSchema from '$/schema/SuiNetwork_Timestamp.ts'
import TezosNetwork_TimestampSchema from '$/schema/TezosNetwork_Timestamp.ts'
import TonNetwork_TimestampSchema from '$/schema/TonNetwork_Timestamp.ts'
import TronNetwork_TimestampSchema from '$/schema/TronNetwork_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.BittensorNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.BittensorNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.CardanoNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CardanoNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.FilecoinNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.FilecoinNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.HederaNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.MoneroNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.MoneroNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.TonNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TonNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.TronNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TronNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.AvailNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.AvailNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.CelestiaNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CelestiaNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.DydxChainNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.DydxChainNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.LightningNetwork_Timestamp
			readonly selectorName: 'LightningNetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.LightningNetwork_Timestamp,
				'LightningNetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.StarknetNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.StarknetNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.HyperliquidNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HyperliquidNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.IcpNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.IcpNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.KaspaNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.KaspaNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.LogosBlockchainNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.LogosBlockchainNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.StellarNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.StellarNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.SuiNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.SuiNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.TezosNetwork_Timestamp
			readonly selectorName: 'NetworkTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TezosNetwork_Timestamp,
				'NetworkTimestampMsSource'
			>
		}
	)[] = []

	if (
		parentData.projectionNetwork.namespace === 'Bittensor'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const bittensorNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			BittensorNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(bittensorNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.BittensorNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: bittensorNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Cardano'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const cardanoNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			CardanoNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(cardanoNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CardanoNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: cardanoNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Filecoin'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const filecoinNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			FilecoinNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(filecoinNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.FilecoinNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: filecoinNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Hedera'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const hederaNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			HederaNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(hederaNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: hederaNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Monero'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const moneroNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			MoneroNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(moneroNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.MoneroNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: moneroNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Ton'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const tonNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			TonNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(tonNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TonNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: tonNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Tron'
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.timestampMs)
	) {
		const tronNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			TronNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(tronNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TronNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: tronNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Avail'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const availNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			AvailNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(availNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.AvailNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: availNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Celestia'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const celestiaNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			CelestiaNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(celestiaNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CelestiaNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: celestiaNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Dydx'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const dydxChainNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			DydxChainNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(dydxChainNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.DydxChainNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: dydxChainNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Lightning'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const lightningNetworkTimestampLightningNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			LightningNetwork_TimestampSchema,
			{
				$lightningNetwork: {
					$lightningNetwork: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'LightningNetworkTimestampMsSource'
		)
		if (!(lightningNetworkTimestampLightningNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.LightningNetwork_Timestamp,
				selectorName: 'LightningNetworkTimestampMsSource',
				selector: lightningNetworkTimestampLightningNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Starknet'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const starknetNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			StarknetNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(starknetNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.StarknetNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: starknetNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Hyperliquid'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const hyperliquidNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			HyperliquidNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(hyperliquidNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HyperliquidNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: hyperliquidNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'InternetComputer'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const icpNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			IcpNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(icpNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.IcpNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: icpNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Kaspa'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const kaspaNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			KaspaNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(kaspaNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.KaspaNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: kaspaNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Logos'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const logosBlockchainNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			LogosBlockchainNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(logosBlockchainNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.LogosBlockchainNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: logosBlockchainNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Stellar'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const stellarNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			StellarNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(stellarNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.StellarNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: stellarNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Sui'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const suiNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			SuiNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(suiNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.SuiNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: suiNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Tezos'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const tezosNetworkTimestampNetworkTimestampMsSourceSelector = parseEntitySelector(
			schema,
			TezosNetwork_TimestampSchema,
			{
				$network: {
					$network: parentData.selector,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if (!(tezosNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TezosNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: tezosNetworkTimestampNetworkTimestampMsSourceSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
