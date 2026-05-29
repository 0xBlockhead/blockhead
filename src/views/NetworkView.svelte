<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.Network,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			slug: {},
			caip2: {},
			namespace: {},
			environment: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CosmosNetworkView from '$/views/CosmosNetworkView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import FilecoinNetworkView from '$/views/FilecoinNetworkView.svelte'
	import HyperliquidNetworkView from '$/views/HyperliquidNetworkView.svelte'
	import LightningNetworkView from '$/views/LightningNetworkView.svelte'
	import LogosNetworkView from '$/views/LogosNetworkView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
	import NearNetworkView from '$/views/NearNetworkView.svelte'
	import PolkadotNetworkView from '$/views/PolkadotNetworkView.svelte'
	import QuillibriumNetworkView from '$/views/QuilibriumNetworkView.svelte'
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
		{@const networkHref = href ?? (
			row.caip2 == null ?
				resolve(`/network/${encodeURIComponent(row.slug)}`)
			:
				resolve(`/network/${encodeURIComponent(row.caip2.namespace)}:${encodeURIComponent(row.caip2.reference)}`)
		)}
		{@const networkEntityId = row.caip2 == null ? { networkSlug: row.slug } : { caip2: row.caip2 }}
		{#if row.namespace === NetworkNamespace.Evm && row.caip2 != null}
			<EvmNetworkView
				entityId={{
					caip2: {
						namespace: 'eip155',
						reference: row.caip2.reference,
					},
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Bitcoin || row.namespace === NetworkNamespace.BitcoinCash || row.namespace === NetworkNamespace.Litecoin || row.namespace === NetworkNamespace.Dogecoin || row.namespace === NetworkNamespace.Zcash}
			<UtxoNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Solana && row.caip2 != null}
			<SolanaNetworkView
				entityId={{
					caip2: {
						namespace: 'solana',
						reference: row.caip2.reference,
					},
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Cosmos}
			<CosmosNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Filecoin}
			<FilecoinNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Polkadot}
			<PolkadotNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Monero}
			<MoneroNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Near}
			<NearNetworkView
				entityId={{ networkSlug: 'near' }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Tron}
			<TronNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Hyperliquid}
			<HyperliquidNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Lightning}
			<LightningNetworkView
				entityId={{
					$network: networkEntityId,
				}}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.ZeroG}
			<ZeroGNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Logos}
			<LogosNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Quilibrium}
			<QuillibriumNetworkView
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

						<div>
							<dt>Environment</dt>
							<dd>{row.environment}</dd>
						</div>
					</dl>
				{/snippet}
			</EntityView>
		{/if}
	{/snippet}
</ResourceBoundary>
