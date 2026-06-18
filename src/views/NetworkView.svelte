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

	const selector = $derived(selection.entitySelector)

	

	

	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
		'caip2' in selector ?
			selector.caip2
		:
			undefined
	)}
		{@const networkSlug = row.slug ?? (
		'slug' in selector ?
			selector.slug
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
		{@const networkSelector = (
			networkCaip2 == null ?
				{ slug: networkSlug }
			:
				{ caip2: networkCaip2 }
		)}
		{@const networkNamespace = row.namespace ?? (
			networkCaip2 == null ?
				undefined
			:
				networkByCaip2[`${networkCaip2.namespace}:${networkCaip2.reference}`]?.namespace
		)}
		{#if networkNamespace === NetworkNamespace.Evm && networkCaip2 != null}
			<EvmNetworkView
				selector={{
					caip2: {
						namespace: 'eip155',
						reference: networkCaip2.reference,
					},
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Bitcoin || networkNamespace === NetworkNamespace.BitcoinCash || networkNamespace === NetworkNamespace.Litecoin || networkNamespace === NetworkNamespace.Dogecoin || networkNamespace === NetworkNamespace.Zcash}
			<UtxoNetworkView
				selector={{ $network: networkSelector }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Solana && networkCaip2 != null}
			<SolanaNetworkView
				selector={{
					caip2: {
						namespace: 'solana',
						reference: networkCaip2.reference,
					},
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Cosmos}
			<CosmosNetworkView
				selector={{ $network: networkSelector }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Filecoin}
			<FilecoinNetworkView
				selector={{ $network: networkSelector }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Polkadot}
			<PolkadotNetworkView
				selector={{ $network: networkSelector }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Monero}
			<MoneroNetworkView
				selector={{ $network: networkSelector }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Near}
			<NearNetworkView
				selector={{ slug: 'near' }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Tron}
			<TronNetworkView
				selector={{ $network: networkSelector }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Hyperliquid}
			<HyperliquidNetworkView
				selector={{ $network: networkSelector }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Bittensor}
			<BittensorNetworkView
				selector={{ $network: networkSelector }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Lightning}
			<LightningNetworkView
				selector={{
					$network: networkSelector,
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.ZeroG}
			<ZeroGNetworkView
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Logos}
			<LogosNetworkView
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Quilibrium}
			<QuilibriumNetworkView
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else}
			<EntityView
				entityType={EntityType.Network}
				entitySelector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
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
			</EntityView>
		{/if}
	{/snippet}
</ResourceBoundary>
