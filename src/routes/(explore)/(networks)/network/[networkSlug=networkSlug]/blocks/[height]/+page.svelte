<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types'
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	}: PageProps = $props()

	const network = $derived(select(EntityType.Network,
		{ slug: params.networkSlug },
		({ sources: [Source.Constants_Internal], fields: { namespace: true, slug: true } }),
	))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{@const selector = { slug: params.networkSlug }}
			{#if network.fields.namespace === NetworkNamespace.Bitcoin || network.fields.namespace === NetworkNamespace.BitcoinCash || network.fields.namespace === NetworkNamespace.Litecoin || network.fields.namespace === NetworkNamespace.Dogecoin || network.fields.namespace === NetworkNamespace.Zcash}
				<UtxoBlockView selection={select(EntityType.UtxoBlock, { $network: selector, height: BigInt(params.height) })} />
			{:else if network.fields.namespace === NetworkNamespace.Cosmos}
				<CosmosBlockView selection={select(EntityType.CosmosBlock, { $network: selector, height: BigInt(params.height) })} />
			{:else if network.fields.namespace === NetworkNamespace.Solana}
				<SolanaBlockView selection={select(EntityType.SolanaBlock, { $network: selector, slot: BigInt(params.height) })} />
			{:else if network.fields.namespace === NetworkNamespace.Polkadot}
				<PolkadotBlockView selection={select(EntityType.PolkadotBlock, { $network: selector, blockNumber: BigInt(params.height) })} />
			{:else}
				<p data-text="muted">Block detail not available for this network type yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
