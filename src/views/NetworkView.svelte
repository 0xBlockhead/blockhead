<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { caip2RouteParams } from '$/lib/caip.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = (
			'networkSlug' in entityId ?
				resolve(
					'/(explore)/network/[networkSlug]',
					{ networkSlug: entityId.networkSlug },
				)
			:
				resolve(
					'/(explore)/network/[caip2Namespace]:[caip2Reference]',
					{ ...caip2RouteParams(entityId) },
				)
		),
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
		{#if row.namespace === NetworkNamespace.Evm && 'caip2' in entityId}
			<EvmNetworkView
				entityId={{
					caip2: {
						namespace: 'eip155',
						reference: entityId.caip2.reference,
					},
				}}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Bitcoin || row.namespace === NetworkNamespace.BitcoinCash || row.namespace === NetworkNamespace.Litecoin || row.namespace === NetworkNamespace.Dogecoin || row.namespace === NetworkNamespace.Zcash}
			<UtxoNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Solana}
			<SolanaNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Cosmos}
			<CosmosNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Filecoin}
			<FilecoinNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Polkadot}
			<PolkadotNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Monero}
			<MoneroNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Near}
			<NearNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Tron}
			<TronNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Hyperliquid}
			<HyperliquidNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Lightning}
			<LightningNetworkView
				entityId={{
					$network: entityId,
				}}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.ZeroG}
			<ZeroGNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Logos}
			<LogosNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else if row.namespace === NetworkNamespace.Quilibrium}
			<QuillibriumNetworkView
				{entityId}
				{href}
				bind:open
				{layout}
			/>
		{:else}
			<EntityView
				entityType={EntityType.Network}
				{entityId}
				{href}
				bind:open
				{layout}
			>
				{#snippet Title()}
					{row.slug}
				{/snippet}

				{#snippet Heading()}
					{row.name}
				{/snippet}

				{#snippet Details()}
					<dl>
						<div>
							<dt>Slug</dt>
							<dd>{row.slug}</dd>
						</div>

						{#if 'caip2' in entityId}
							<div>
								<dt>CAIP-2</dt>
								<dd>
									{entityId.caip2.namespace}:{entityId.caip2.reference}
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
