// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
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

	const bittensorNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Bittensor'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const bittensorNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			BittensorNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if ((!(bittensorNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.BittensorNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: bittensorNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const cardanoNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Cardano'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const cardanoNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			CardanoNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if ((!(cardanoNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CardanoNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: cardanoNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const filecoinNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Filecoin'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const filecoinNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			FilecoinNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if ((!(filecoinNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.FilecoinNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: filecoinNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const hederaNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Hedera'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const hederaNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			HederaNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if ((!(hederaNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: hederaNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const moneroNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Monero'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const moneroNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			MoneroNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if ((!(moneroNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.MoneroNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: moneroNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const tonNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Ton'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const tonNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			TonNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if ((!(tonNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TonNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: tonNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const tronNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Tron'
			&& matchStringSegment(params.source)
			&& matchNonNegativeInteger(params.timestampMs)
		))
			return

		const tronNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			TronNetwork_TimestampSchema,
			{
				$network: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'NetworkTimestampMsSource'
		)
		if ((!(tronNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: tronNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const availNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Avail'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const availNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(availNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.AvailNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: availNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const celestiaNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Celestia'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const celestiaNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(celestiaNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CelestiaNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: celestiaNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const dydxChainNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Dydx'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const dydxChainNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(dydxChainNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.DydxChainNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: dydxChainNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const lightningNetworkTimestampLightningNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Lightning'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const lightningNetworkTimestampLightningNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(lightningNetworkTimestampLightningNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.LightningNetwork_Timestamp,
				selectorName: 'LightningNetworkTimestampMsSource',
				selector: lightningNetworkTimestampLightningNetworkTimestampMsSourceSelector,
			} as const
	})()

	const starknetNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Starknet'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const starknetNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(starknetNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.StarknetNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: starknetNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const hyperliquidNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Hyperliquid'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const hyperliquidNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(hyperliquidNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HyperliquidNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: hyperliquidNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const icpNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'InternetComputer'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const icpNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(icpNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.IcpNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: icpNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const kaspaNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Kaspa'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const kaspaNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(kaspaNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.KaspaNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: kaspaNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const logosBlockchainNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Logos'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const logosBlockchainNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(logosBlockchainNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.LogosBlockchainNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: logosBlockchainNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const stellarNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Stellar'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const stellarNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(stellarNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.StellarNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: stellarNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const suiNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Sui'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const suiNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(suiNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.SuiNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: suiNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const tezosNetworkTimestampNetworkTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Tezos'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const tezosNetworkTimestampNetworkTimestampMsSourceSelector = parseRouteEntitySelector(
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
		if ((!(tezosNetworkTimestampNetworkTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TezosNetwork_Timestamp,
				selectorName: 'NetworkTimestampMsSource',
				selector: tezosNetworkTimestampNetworkTimestampMsSourceSelector,
			} as const
	})()

	const routeCandidates = [
		bittensorNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		cardanoNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		filecoinNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		hederaNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		moneroNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		tonNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		tronNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		availNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		celestiaNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		dydxChainNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		lightningNetworkTimestampLightningNetworkTimestampMsSourceSelectorCandidate,
		starknetNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		hyperliquidNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		icpNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		kaspaNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		logosBlockchainNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		stellarNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		suiNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
		tezosNetworkTimestampNetworkTimestampMsSourceSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
