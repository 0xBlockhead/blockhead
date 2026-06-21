<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types'
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
			], fields: { namespace: true, slug: true } }),
	))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningPaymentsView from '$/views/LightningPaymentsView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.fields.namespace === NetworkNamespace.Lightning}
				<LightningPaymentsView
					selection={select(
						EntityType.LightningNetwork,
						{
							$network: {
								slug: params.networkSlug,
							},
						}
					).$$payments({
						sources: [
							Source.LightningLnd_Rest,
						],
						limit: 32,
					})}
					href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/payments', {
						networkSlug: params.networkSlug,
					})}
					id="payments"
				/>
			{:else}
				<p data-text="muted">This network does not expose a payments route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
