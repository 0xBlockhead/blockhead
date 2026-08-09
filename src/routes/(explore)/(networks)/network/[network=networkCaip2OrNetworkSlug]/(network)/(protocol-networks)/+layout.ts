// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import AptosNetworkSchema from '$/schema/AptosNetwork.ts'
import ArweaveNetworkSchema from '$/schema/ArweaveNetwork.ts'
import AvailNetworkSchema from '$/schema/AvailNetwork.ts'
import BittensorNetworkSchema from '$/schema/BittensorNetwork.ts'
import CelestiaNetworkSchema from '$/schema/CelestiaNetwork.ts'
import DydxChainNetworkSchema from '$/schema/DydxChainNetwork.ts'
import { EntityType } from '$/schema/EntityType.ts'
import FilecoinNetworkSchema from '$/schema/FilecoinNetwork.ts'
import HyperliquidNetworkSchema from '$/schema/HyperliquidNetwork.ts'
import IcpNetworkSchema from '$/schema/IcpNetwork.ts'
import { schema } from '$/schema/index.ts'
import KaspaNetworkSchema from '$/schema/KaspaNetwork.ts'
import LightningNetworkSchema from '$/schema/LightningNetwork.ts'
import LogosBlockchainNetworkSchema from '$/schema/LogosBlockchainNetwork.ts'
import MoneroNetworkSchema from '$/schema/MoneroNetwork.ts'
import StarknetNetworkSchema from '$/schema/StarknetNetwork.ts'
import StellarNetworkSchema from '$/schema/StellarNetwork.ts'
import SuiNetworkSchema from '$/schema/SuiNetwork.ts'
import TezosNetworkSchema from '$/schema/TezosNetwork.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.AptosNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.AptosNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.ArweaveNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.ArweaveNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.AvailNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.AvailNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.BittensorNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.BittensorNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.CelestiaNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CelestiaNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.DydxChainNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.DydxChainNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.FilecoinNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.FilecoinNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.HyperliquidNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HyperliquidNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.LightningNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.LightningNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.MoneroNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.MoneroNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.StarknetNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.StarknetNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.IcpNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.IcpNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.KaspaNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.KaspaNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.LogosBlockchainNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.LogosBlockchainNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.StellarNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.StellarNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.SuiNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.SuiNetwork,
				'Network'
			>
		}
		| {
			readonly entityType: EntityType.TezosNetwork
			readonly selectorName: 'Network'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TezosNetwork,
				'Network'
			>
		}
	)[] = []

	if (parentData.projectionNetwork.namespace === 'Aptos') {
		const aptosNetworkNetworkSelector = parseEntitySelector(
			schema,
			AptosNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(aptosNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.AptosNetwork,
				selectorName: 'Network',
				selector: aptosNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Arweave') {
		const arweaveNetworkNetworkSelector = parseEntitySelector(
			schema,
			ArweaveNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(arweaveNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.ArweaveNetwork,
				selectorName: 'Network',
				selector: arweaveNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Avail') {
		const availNetworkNetworkSelector = parseEntitySelector(
			schema,
			AvailNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(availNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.AvailNetwork,
				selectorName: 'Network',
				selector: availNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Bittensor') {
		const bittensorNetworkNetworkSelector = parseEntitySelector(
			schema,
			BittensorNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(bittensorNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.BittensorNetwork,
				selectorName: 'Network',
				selector: bittensorNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Celestia') {
		const celestiaNetworkNetworkSelector = parseEntitySelector(
			schema,
			CelestiaNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(celestiaNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CelestiaNetwork,
				selectorName: 'Network',
				selector: celestiaNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Dydx') {
		const dydxChainNetworkNetworkSelector = parseEntitySelector(
			schema,
			DydxChainNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(dydxChainNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.DydxChainNetwork,
				selectorName: 'Network',
				selector: dydxChainNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Filecoin') {
		const filecoinNetworkNetworkSelector = parseEntitySelector(
			schema,
			FilecoinNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(filecoinNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.FilecoinNetwork,
				selectorName: 'Network',
				selector: filecoinNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Hyperliquid') {
		const hyperliquidNetworkNetworkSelector = parseEntitySelector(
			schema,
			HyperliquidNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(hyperliquidNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HyperliquidNetwork,
				selectorName: 'Network',
				selector: hyperliquidNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Lightning') {
		const lightningNetworkNetworkSelector = parseEntitySelector(
			schema,
			LightningNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(lightningNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.LightningNetwork,
				selectorName: 'Network',
				selector: lightningNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Monero') {
		const moneroNetworkNetworkSelector = parseEntitySelector(
			schema,
			MoneroNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(moneroNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.MoneroNetwork,
				selectorName: 'Network',
				selector: moneroNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Starknet') {
		const starknetNetworkNetworkSelector = parseEntitySelector(
			schema,
			StarknetNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(starknetNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.StarknetNetwork,
				selectorName: 'Network',
				selector: starknetNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'InternetComputer') {
		const icpNetworkNetworkSelector = parseEntitySelector(
			schema,
			IcpNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(icpNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.IcpNetwork,
				selectorName: 'Network',
				selector: icpNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Kaspa') {
		const kaspaNetworkNetworkSelector = parseEntitySelector(
			schema,
			KaspaNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(kaspaNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.KaspaNetwork,
				selectorName: 'Network',
				selector: kaspaNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Logos') {
		const logosBlockchainNetworkNetworkSelector = parseEntitySelector(
			schema,
			LogosBlockchainNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(logosBlockchainNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.LogosBlockchainNetwork,
				selectorName: 'Network',
				selector: logosBlockchainNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Stellar') {
		const stellarNetworkNetworkSelector = parseEntitySelector(
			schema,
			StellarNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(stellarNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.StellarNetwork,
				selectorName: 'Network',
				selector: stellarNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Sui') {
		const suiNetworkNetworkSelector = parseEntitySelector(
			schema,
			SuiNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(suiNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.SuiNetwork,
				selectorName: 'Network',
				selector: suiNetworkNetworkSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Tezos') {
		const tezosNetworkNetworkSelector = parseEntitySelector(
			schema,
			TezosNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if (!(tezosNetworkNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TezosNetwork,
				selectorName: 'Network',
				selector: tezosNetworkNetworkSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
