// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
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

	const aptosNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Aptos'))
			return

		const aptosNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			AptosNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(aptosNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.AptosNetwork,
				selectorName: 'Network',
				selector: aptosNetworkNetworkSelector,
			} as const
	})()

	const arweaveNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Arweave'))
			return

		const arweaveNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			ArweaveNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(arweaveNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.ArweaveNetwork,
				selectorName: 'Network',
				selector: arweaveNetworkNetworkSelector,
			} as const
	})()

	const availNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Avail'))
			return

		const availNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			AvailNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(availNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.AvailNetwork,
				selectorName: 'Network',
				selector: availNetworkNetworkSelector,
			} as const
	})()

	const bittensorNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Bittensor'))
			return

		const bittensorNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			BittensorNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(bittensorNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.BittensorNetwork,
				selectorName: 'Network',
				selector: bittensorNetworkNetworkSelector,
			} as const
	})()

	const celestiaNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Celestia'))
			return

		const celestiaNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			CelestiaNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(celestiaNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CelestiaNetwork,
				selectorName: 'Network',
				selector: celestiaNetworkNetworkSelector,
			} as const
	})()

	const dydxChainNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Dydx'))
			return

		const dydxChainNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			DydxChainNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(dydxChainNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.DydxChainNetwork,
				selectorName: 'Network',
				selector: dydxChainNetworkNetworkSelector,
			} as const
	})()

	const filecoinNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Filecoin'))
			return

		const filecoinNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			FilecoinNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(filecoinNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.FilecoinNetwork,
				selectorName: 'Network',
				selector: filecoinNetworkNetworkSelector,
			} as const
	})()

	const hyperliquidNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Hyperliquid'))
			return

		const hyperliquidNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			HyperliquidNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(hyperliquidNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HyperliquidNetwork,
				selectorName: 'Network',
				selector: hyperliquidNetworkNetworkSelector,
			} as const
	})()

	const lightningNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Lightning'))
			return

		const lightningNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			LightningNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(lightningNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.LightningNetwork,
				selectorName: 'Network',
				selector: lightningNetworkNetworkSelector,
			} as const
	})()

	const moneroNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Monero'))
			return

		const moneroNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			MoneroNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(moneroNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.MoneroNetwork,
				selectorName: 'Network',
				selector: moneroNetworkNetworkSelector,
			} as const
	})()

	const starknetNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Starknet'))
			return

		const starknetNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			StarknetNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(starknetNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.StarknetNetwork,
				selectorName: 'Network',
				selector: starknetNetworkNetworkSelector,
			} as const
	})()

	const icpNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'InternetComputer'))
			return

		const icpNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			IcpNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(icpNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.IcpNetwork,
				selectorName: 'Network',
				selector: icpNetworkNetworkSelector,
			} as const
	})()

	const kaspaNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Kaspa'))
			return

		const kaspaNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			KaspaNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(kaspaNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.KaspaNetwork,
				selectorName: 'Network',
				selector: kaspaNetworkNetworkSelector,
			} as const
	})()

	const logosBlockchainNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Logos'))
			return

		const logosBlockchainNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			LogosBlockchainNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(logosBlockchainNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.LogosBlockchainNetwork,
				selectorName: 'Network',
				selector: logosBlockchainNetworkNetworkSelector,
			} as const
	})()

	const stellarNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Stellar'))
			return

		const stellarNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			StellarNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(stellarNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.StellarNetwork,
				selectorName: 'Network',
				selector: stellarNetworkNetworkSelector,
			} as const
	})()

	const suiNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Sui'))
			return

		const suiNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			SuiNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(suiNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.SuiNetwork,
				selectorName: 'Network',
				selector: suiNetworkNetworkSelector,
			} as const
	})()

	const tezosNetworkNetworkSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Tezos'))
			return

		const tezosNetworkNetworkSelector = parseRouteEntitySelector(
			schema,
			TezosNetworkSchema,
			{
				$network: parentData.selector,
			},
			'Network'
		)
		if ((!(tezosNetworkNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TezosNetwork,
				selectorName: 'Network',
				selector: tezosNetworkNetworkSelector,
			} as const
	})()

	const routeCandidates = [
		aptosNetworkNetworkSelectorCandidate,
		arweaveNetworkNetworkSelectorCandidate,
		availNetworkNetworkSelectorCandidate,
		bittensorNetworkNetworkSelectorCandidate,
		celestiaNetworkNetworkSelectorCandidate,
		dydxChainNetworkNetworkSelectorCandidate,
		filecoinNetworkNetworkSelectorCandidate,
		hyperliquidNetworkNetworkSelectorCandidate,
		lightningNetworkNetworkSelectorCandidate,
		moneroNetworkNetworkSelectorCandidate,
		starknetNetworkNetworkSelectorCandidate,
		icpNetworkNetworkSelectorCandidate,
		kaspaNetworkNetworkSelectorCandidate,
		logosBlockchainNetworkNetworkSelectorCandidate,
		stellarNetworkNetworkSelectorCandidate,
		suiNetworkNetworkSelectorCandidate,
		tezosNetworkNetworkSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
