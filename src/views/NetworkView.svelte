<script lang="ts">
	// Types/constants
	import {
		NetworkNamespace,
		caip2NetworkNamespaceByNamespace,
		networkEnvironmentByEnvironment,
	} from '$/constants/Network.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.Network>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = subscribe(EntityType.Network,
		selector,
		({ sources: [
				Source.Constants_Internal,
			], fields: { name: true, slug: true, caip2: true, namespace: true, environment: true } }),
	)


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
	resource={network}
>
	{#snippet children(row)}
		{@const networkCaip2 = row.fields.caip2 ?? ('caip2' in selector ? selector.caip2 : undefined)}
		{@const networkSlug = row.fields.slug ?? ('networkSlug' in selector ? selector.networkSlug : undefined)}
		{@const networkHref = href ?? (
			networkCaip2 == null ?
				networkSlug == null ?
					undefined
				:
					resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
						networkSlug,
					})
				:
					resolve('/(explore)/(networks)/network/[caip2Namespace=caip2Namespace]:[caip2Reference=caip2Reference]', {
						caip2Namespace: networkCaip2.namespace,
						caip2Reference: networkCaip2.reference,
					})
		)}
		{@const networkSelector = (
			networkCaip2 == null ?
				networkSlug == null ?
					selector
				:
					{ networkSlug }
			:
				{ caip2: networkCaip2 }
		)}
		{@const networkNamespace = row.fields.namespace ?? (
			networkCaip2 == null ?
				undefined
			:
				Object.entries(caip2NetworkNamespaceByNamespace)
					.find(([caip2Namespace]) => caip2Namespace === networkCaip2.namespace)
					?.[1]
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
				selector={networkSelector}
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
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Filecoin}
			<FilecoinNetworkView
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Polkadot}
			<PolkadotNetworkView
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Monero}
			<MoneroNetworkView
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Near}
			<NearNetworkView
				selector={{ networkSlug: 'near' }}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Tron}
			<TronNetworkView
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Hyperliquid}
			<HyperliquidNetworkView
				selector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Bittensor}
			<BittensorNetworkView
				selector={networkSelector}
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
			{row.fields.name}
		{/snippet}

		{#snippet Content()}
			<dl>
				{#if row.fields.caip2 != null}
					<div>
						<dt>CAIP-2</dt>
						<dd>
							{row.fields.caip2.namespace}:{row.fields.caip2.reference}
						</dd>
					</div>
				{/if}

				{#if row.fields.environment !== undefined}
					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[row.fields.environment].label}</dd>
					</div>
				{/if}
			</dl>
		{/snippet}
			</EntityView>
		{/if}
	{/snippet}
</ResourceBoundary>
