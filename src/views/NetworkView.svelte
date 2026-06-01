<script lang="ts">
	// Types/constants
	import { NetworkNamespace, networkEnvironmentByEnvironment } from '$/constants/Network.ts'
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
		{@const networkHref = href ?? (
			network.caip2 == null ?
				resolve(`/network/${encodeURIComponent(network.slug)}`)
			:
				resolve(`/network/${encodeURIComponent(network.caip2.namespace)}:${encodeURIComponent(network.caip2.reference)}`)
		)}
		{@const networkEntityId = network.caip2 == null ? { networkSlug: network.slug }
		:
			{ caip2: network.caip2 }}
		{#if network.namespace === NetworkNamespace.Evm && network.caip2 != null}
			<EvmNetworkView
				entityId={{
					caip2: {
						namespace: 'eip155',
						reference: network.caip2.reference,
					},
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
			<UtxoNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Solana && network.caip2 != null}
			<SolanaNetworkView
				entityId={{
					caip2: {
						namespace: 'solana',
						reference: network.caip2.reference,
					},
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Cosmos}
			<CosmosNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Filecoin}
			<FilecoinNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Polkadot}
			<PolkadotNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Monero}
			<MoneroNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Near}
			<NearNetworkView
				entityId={{ networkSlug: 'near' }}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Tron}
			<TronNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Hyperliquid}
			<HyperliquidNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Bittensor}
			<BittensorNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Lightning}
			<LightningNetworkView
				entityId={{
					$network: networkEntityId,
				}}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.ZeroG}
			<ZeroGNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Logos}
			<LogosNetworkView
				entityId={networkEntityId}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if network.namespace === NetworkNamespace.Quilibrium}
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
					{network.name}
	{/snippet}

	{#snippet Content()}
					<dl>
						{#if network.caip2 != null}
							<div>
								<dt>CAIP-2</dt>
								<dd>
									{network.caip2.namespace}:{network.caip2.reference}
								</dd>
							</div>
						{/if}

						<div>
							<dt>Environment</dt>
							<dd>{networkEnvironmentByEnvironment[network.environment].label}</dd>
						</div>
					</dl>
				{/snippet}
			</EntityView>
		{/if}
	{/snippet}
</ResourceBoundary>
