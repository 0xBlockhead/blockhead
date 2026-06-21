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
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.fields.namespace === NetworkNamespace.Lightning}
				<LightningChannelView
					selection={select(EntityType.LightningChannel, {
						$network: { slug: params.networkSlug },
						channelId: params.channelId,
					})}
				/>
			{:else}
				<p data-text="muted">This network does not expose a channel detail route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
