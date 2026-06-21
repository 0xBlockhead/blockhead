<script lang="ts">
	import type { PageProps } from './$types'
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	}: PageProps = $props()

	const network = $derived(select(EntityType.Network,
		{
			slug: params.networkSlug,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { namespace: true } }),
	))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, {
							$network: { slug: params.networkSlug },
							txId: params.txId,
						})}
					/>
			{:else if network.namespace === NetworkNamespace.ZeroG}
				<EvmTransactionView
					selection={select(EntityType.EvmTransaction, {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: '16661',
							},
						},
						txHash: ZeroExHex.assert(params.txId),
					})}
				/>
			{:else}
				<p data-text="muted">This network does not expose a transaction detail route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
