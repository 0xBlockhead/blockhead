<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	const network = $derived(subscribe(EntityType.Network,
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
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.fields.namespace === NetworkNamespace.Lightning}
				<LightningChannelsView
					entityFieldReference={{
						entityType: EntityType.LightningNetwork,
						selector: {
							$network: {
								slug: network.fields.slug,
							},
						},
						fieldName: '$$channels',
					}}
						href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels', {
							networkSlug: params.networkSlug,
						})}
					id="channels"
				/>
			{:else}
				<p data-text="muted">This network does not expose a channels route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
