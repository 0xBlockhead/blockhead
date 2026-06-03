<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		params,
	} = $props()

	const network = useEntity(
		EntityType.Network,
		{ networkSlug: params.networkSlug },
		{
			$: [Source.Constants_Internal],
			namespace: {},
			slug: {},
		},
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{@const entityId = { networkSlug: network.slug }}
			{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
				<UtxoAddressView entityId={{ $network: entityId, address: params.address }} />
			{:else}
				<p data-text="muted">Address detail not available for this network type yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
