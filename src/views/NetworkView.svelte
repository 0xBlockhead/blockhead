<script lang="ts">
	// Types/constants
	import {
		NetworkNamespace,
		networkByCaip2,
		networkEnvironmentByEnvironment,
	} from '$/constants/Network.ts'

	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'

	type NetworkResource = EntityProxyResource<typeof schema, EntityType.Network>


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selection: NetworkResource
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BittensorNetworkView from '$/views/BittensorNetworkView.svelte'
	import CosmosNetworkView from '$/views/CosmosNetworkView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import FilecoinNetworkView from '$/views/FilecoinNetworkView.svelte'
	import HyperliquidNetworkView from '$/views/HyperliquidNetworkView.svelte'
	import LightningNetworkView from '$/views/LightningNetworkView.svelte'
	import LogosNetworkView from '$/views/LogosNetworkView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
	import NearNetworkView from '$/views/NearNetworkView.svelte'
	import PolkadotNetworkView from '$/views/PolkadotNetworkView.svelte'
	import QuilibriumNetworkView from '$/views/QuilibriumNetworkView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaNetworkView from '$/views/SolanaNetworkView.svelte'
	import TronNetworkView from '$/views/TronNetworkView.svelte'
	import UtxoNetworkView from '$/views/UtxoNetworkView.svelte'
	import ZeroGNetworkView from '$/views/ZeroGNetworkView.svelte'
</script>


<ResourceBoundary
	resource={selection}
>
	{#snippet children(row)}
		{@const networkCaip2 = row.caip2 ?? (
			'caip2' in selection.entitySelector ?
				selection.entitySelector.caip2
			:
				undefined
		)}
		{@const networkSlug = row.slug ?? (
			'slug' in selection.entitySelector ?
				selection.entitySelector.slug
			:
				undefined
		)}
		{@const networkHref = href ?? (
			networkCaip2 == null ?
				networkSlug == null ?
					undefined
				:
					resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
						networkSlug,
					})
				:
					resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
						caip2: `${networkCaip2.namespace}:${networkCaip2.reference}`,
					})
		)}
		{@const networkSelector = selection.entitySelector}
		{@const networkNamespace = row.namespace ?? (
			networkCaip2 == null ?
				undefined
			:
				networkByCaip2[`${networkCaip2.namespace}:${networkCaip2.reference}`]?.namespace
		)}
		{#if networkNamespace === NetworkNamespace.Evm && networkCaip2 != null}
			<EvmNetworkView
				selection={select(EntityType.EvmNetwork, {
					caip2: {
						namespace: 'eip155',
						reference: networkCaip2.reference,
					},
				})}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Bitcoin || networkNamespace === NetworkNamespace.BitcoinCash || networkNamespace === NetworkNamespace.Litecoin || networkNamespace === NetworkNamespace.Dogecoin || networkNamespace === NetworkNamespace.Zcash}
			<UtxoNetworkView
				selection={select(EntityType.UtxoNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Solana && networkCaip2 != null}
			<SolanaNetworkView
				selection={select(EntityType.SolanaNetwork, {
					caip2: {
						namespace: 'solana',
						reference: networkCaip2.reference,
					},
				})}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Cosmos}
			<CosmosNetworkView
				selection={select(EntityType.CosmosNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Filecoin}
			<FilecoinNetworkView
				selection={select(EntityType.FilecoinNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Polkadot}
			<PolkadotNetworkView
				selection={select(EntityType.PolkadotNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Monero}
			<MoneroNetworkView
				selection={select(EntityType.MoneroNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Near}
			<NearNetworkView
				selection={select(EntityType.NearNetwork, { slug: 'near' })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Tron}
			<TronNetworkView
				selection={select(EntityType.TronNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Hyperliquid}
			<HyperliquidNetworkView
				selection={select(EntityType.HyperliquidNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Bittensor}
			<BittensorNetworkView
				selection={select(EntityType.BittensorNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Lightning}
			<LightningNetworkView
				selection={select(EntityType.LightningNetwork, {
					$network: networkSelector,
				})}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.ZeroG}
			<ZeroGNetworkView
				selection={select(EntityType.Network, networkSelector)}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Logos}
			<LogosNetworkView
				selection={select(EntityType.Network, networkSelector)}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Quilibrium}
			<QuilibriumNetworkView
				selection={select(EntityType.Network, networkSelector)}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else}
			<EntityView2
				{selection}
				entityType={EntityType.Network}
				entitySelector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
				view={{
					closed: [
						'caip2',
						'environment',
					],
					content: {
						dl: [
							[
								'caip2',
								'environment',
								{
									label: 'stack classification',
								},
								'executionEnvironments',
								'consensusMechanisms',
							],
							[
								{
									label: 'native asset count',
								},
								{
									label: 'explorer/faucet URL counts',
								},
							],
						],
					},
					details: {
						tabs: [
							{
								label: 'Namespace-specific state',
								items: [
									{
										label: 'EVM',
									},
									{
										label: 'UTXO',
									},
									{
										label: 'Solana',
									},
									{
										label: 'Cosmos',
									},
									{
										label: 'Celestia',
									},
									{
										label: 'Avail',
									},
									{
										label: 'Filecoin',
									},
									{
										label: 'Polkadot',
									},
									{
										label: 'Monero',
									},
									{
										label: 'NEAR',
									},
									{
										label: 'TRON',
									},
									{
										label: 'Hyperliquid',
									},
									{
										label: 'Bittensor',
									},
									{
										label: 'Lightning',
									},
									{
										label: 'Arweave',
									},
									{
										label: '0G',
									},
									{
										label: 'Quilibrium',
									},
								],
							},
							{
								label: 'Catalog refs',
								items: [
									'$$nativeAssets',
									'$$blockExplorerUrls',
									'$$faucetUrls',
									{
										label: 'secondary identifiers',
									},
								],
							},
							{
								label: 'Observations',
								items: [
									{
										label: 'Network_Timestamp fallback rows',
									},
									{
										label: 'endpoint observations',
									},
								],
							},
						],
					},
				}}
			>
				{#snippet Title()}
					{row.name}
				{/snippet}

				{#snippet Content()}
					<dl>
						{#if row.caip2 != null}
							<div>
								<dt>CAIP-2</dt>
								<dd>
									{row.caip2.namespace}:{row.caip2.reference}
								</dd>
							</div>
						{/if}

						{#if row.environment !== undefined}
							<div>
								<dt>Environment</dt>
								<dd>{networkEnvironmentByEnvironment[row.environment].label}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</EntityView2>
		{/if}
	{/snippet}
</ResourceBoundary>
