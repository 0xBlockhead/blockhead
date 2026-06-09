<script lang="ts">
	// Types/constants
	import {
		NetworkNamespace,
		caip2NetworkNamespaceByNamespace,
		networkEnvironmentByEnvironment,
	} from '$/constants/Network.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.Network>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = useEntity(entityCollectionsContext, EntityType.Network,
		entityId,
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
		{@const networkCaip2 = row.fields.caip2 ?? ('caip2' in entityId ? entityId.caip2 : undefined)}
		{@const networkSlug = row.fields.slug ?? ('networkSlug' in entityId ? entityId.networkSlug : undefined)}
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
		{@const networkEntityId = (
			networkCaip2 == null ?
				networkSlug == null ?
					entityId
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
				entityId={{
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
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Solana && networkCaip2 != null}
			<SolanaNetworkView
				entityId={{
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
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Filecoin}
			<FilecoinNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Polkadot}
			<PolkadotNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Monero}
			<MoneroNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Near}
			<NearNetworkView
				entityId={{ networkSlug: 'near' }}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Tron}
			<TronNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Hyperliquid}
			<HyperliquidNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Bittensor}
			<BittensorNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Lightning}
			<LightningNetworkView
				entityId={{
					$network: networkEntityId,
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.ZeroG}
			<ZeroGNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Logos}
			<LogosNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
				{:else if networkNamespace === NetworkNamespace.Quilibrium}
			<QuilibriumNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else}
			<EntityView
				entityType={EntityType.Network}
				entityId={networkEntityId}
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
