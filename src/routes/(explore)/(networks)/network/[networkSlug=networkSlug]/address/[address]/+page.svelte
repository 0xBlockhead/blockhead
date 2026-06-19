<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	const network = $derived(select(EntityType.Network,
		{ slug: params.networkSlug },
		({ sources: [Source.Constants_Internal], fields: { namespace: true, slug: true } }),
	))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{@const selector = { slug: network.fields.slug }}
			{#if network.fields.namespace === NetworkNamespace.Bitcoin || network.fields.namespace === NetworkNamespace.BitcoinCash || network.fields.namespace === NetworkNamespace.Litecoin || network.fields.namespace === NetworkNamespace.Dogecoin || network.fields.namespace === NetworkNamespace.Zcash}
				<UtxoAddressView
					selection={select(EntityType.UtxoAddress, { $network: selector, address: params.address })}
				/>
			{:else}
				<p data-text="muted">Address detail not available for this network type yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
