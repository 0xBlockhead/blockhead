<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	const network = $derived(select(EntityType.Network,
		{
			slug: params.networkSlug,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { caip2: true, namespace: true, slug: true } }),
	))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BittensorBlocksView from '$/views/BittensorBlocksView.svelte'
	import CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
	import MoneroBlocksView from '$/views/MoneroBlocksView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import PolkadotBlocksView from '$/views/PolkadotBlocksView.svelte'
	import SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
	import TronBlocksView from '$/views/TronBlocksView.svelte'
	import UtxoBlocksView from '$/views/UtxoBlocksView.svelte'
	import ZeroGBlocksView from '$/views/ZeroGBlocksView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{@const href = resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/blocks', {
				networkSlug: params.networkSlug,
			})}
			{#if network.fields.namespace === NetworkNamespace.Bitcoin || network.fields.namespace === NetworkNamespace.BitcoinCash || network.fields.namespace === NetworkNamespace.Litecoin || network.fields.namespace === NetworkNamespace.Dogecoin || network.fields.namespace === NetworkNamespace.Zcash}
				<UtxoBlocksView
					selection={select(
						EntityType.UtxoNetwork,
						{
							$network: network.fields.caip2 == null ?
								{ slug: network.fields.slug }
							:
								{ caip2: network.fields.caip2 },
						}
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Solana && network.fields.caip2 != null}
				<SolanaBlocksView
					selection={select(
						EntityType.SolanaNetwork,
						{
							caip2: {
								namespace: 'solana',
								reference: network.fields.caip2.reference,
							},
						}
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Cosmos}
				<CosmosBlocksView
					selection={select(
						EntityType.CosmosNetwork,
						{
							$network: network.fields.caip2 == null ?
								{ slug: network.fields.slug }
							:
								{ caip2: network.fields.caip2 },
						}
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Filecoin}
				<FilecoinTipsetsView
					selection={select(
						EntityType.FilecoinNetwork,
						{
							$network: network.fields.caip2 == null ?
								{ slug: network.fields.slug }
							:
								{ caip2: network.fields.caip2 },
						}
					).$$tipsets({
						limit: 16,
					})}
					{href}
					id="blocks"
					title="Tipsets"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Polkadot}
				<PolkadotBlocksView
					selection={select(
						EntityType.PolkadotNetwork,
						{
							$network: network.fields.caip2 == null ?
								{ slug: network.fields.slug }
							:
								{ caip2: network.fields.caip2 },
						}
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Near}
				<NearBlocksView
					selection={select(
						EntityType.NearNetwork,
						{ slug: 'near' }
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Tron}
				<TronBlocksView
					selection={select(
						EntityType.TronNetwork,
						{
							$network: network.fields.caip2 == null ?
								{ slug: network.fields.slug }
							:
								{ caip2: network.fields.caip2 },
						}
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Monero}
				<MoneroBlocksView
					selection={select(
						EntityType.MoneroNetwork,
						{
							$network: network.fields.caip2 == null ?
								{ slug: network.fields.slug }
							:
								{ caip2: network.fields.caip2 },
						}
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Hyperliquid}
				<HyperliquidBlocksView
					selection={select(
						EntityType.HyperliquidNetwork,
						{
							$network: network.fields.caip2 == null ?
								{ slug: network.fields.slug }
							:
								{ caip2: network.fields.caip2 },
						}
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Bittensor}
				<BittensorBlocksView
					selection={select(
						EntityType.BittensorNetwork,
						{
							$network: network.fields.caip2 == null ?
								{ slug: network.fields.slug }
							:
								{ caip2: network.fields.caip2 },
						}
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else if network.fields.namespace === NetworkNamespace.ZeroG}
				<ZeroGBlocksView
					selection={select(
						EntityType.ZeroGNetwork,
						{ slug: '0g' }
					).$$blocks({
						limit: 16,
					})}
					{href}
					id="blocks"
				/>
			{:else}
				<p data-text="muted">This network does not expose a block list route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
