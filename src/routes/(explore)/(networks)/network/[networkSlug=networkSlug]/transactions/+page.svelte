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
	import HyperliquidTransactionsView from '$/views/HyperliquidTransactionsView.svelte'
	import SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{@const selector = network.fields.caip2 == null ?
				{ slug: network.fields.slug }
			:
				{ caip2: network.fields.caip2 }}
			{@const href = resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions', {
				networkSlug: params.networkSlug,
			})}
			{#if network.fields.namespace === NetworkNamespace.Bitcoin || network.fields.namespace === NetworkNamespace.BitcoinCash || network.fields.namespace === NetworkNamespace.Litecoin || network.fields.namespace === NetworkNamespace.Dogecoin || network.fields.namespace === NetworkNamespace.Zcash}
				<UtxoTransactionsView
					selection={select(
						EntityType.UtxoNetwork,
						{ $network: selector }
					).$$transactions({
						limit: 16,
					})}
					{href}
					id="transactions"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Solana && network.fields.caip2 != null}
				<SolanaTransactionsView
					selection={select(
						EntityType.SolanaNetwork,
						{
							caip2: {
								namespace: 'solana',
								reference: network.fields.caip2.reference,
							},
						}
					).$$transactions({
						limit: 16,
					})}
					{href}
					id="transactions"
				/>
			{:else if network.fields.namespace === NetworkNamespace.Hyperliquid}
				<HyperliquidTransactionsView
					selection={select(
						EntityType.HyperliquidNetwork,
						{ $network: selector }
					).$$transactions({
						limit: 16,
					})}
					{href}
					id="transactions"
				/>
			{:else}
				<p data-text="muted">This network does not expose a network-level transactions route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
