<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		params,
	} = $props()

	const network = useEntity(
		EntityType.Network,
		{
			networkSlug: params.networkSlug,
		},
		{
			$: [
				Source.Constants_Internal,
			],
			caip2: {},
			namespace: {},
			slug: {},
		},
	)


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
			{@const entityId = network.caip2 == null ?
				{ networkSlug: network.slug }
			:
				{ caip2: network.caip2 }}
			{@const href = resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions', {
				networkSlug: params.networkSlug,
			})}
			{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
				<UtxoTransactionsView
					entityFieldReference={{
						entityType: EntityType.UtxoNetwork,
						entityId,
						fieldName: '$$transactions',
					}}
					{href}
					id="transactions"
				/>
			{:else if network.namespace === NetworkNamespace.Solana && network.caip2 != null}
				<SolanaTransactionsView
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						entityId: {
							caip2: {
								namespace: 'solana',
								reference: network.caip2.reference,
							},
						},
						fieldName: '$$transactions',
					}}
					{href}
					id="transactions"
				/>
			{:else if network.namespace === NetworkNamespace.Hyperliquid}
				<HyperliquidTransactionsView
					entityFieldReference={{
						entityType: EntityType.HyperliquidNetwork,
						entityId,
						fieldName: '$$transactions',
					}}
					{href}
					id="transactions"
				/>
			{:else}
				<p data-text="muted">This network does not expose a network-level transactions route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
