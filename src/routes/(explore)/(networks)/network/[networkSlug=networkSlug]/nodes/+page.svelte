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

	const network = subscribe(EntityType.Network,
		{
			networkSlug: params.networkSlug,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { namespace: true, slug: true } }),
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.fields.namespace === NetworkNamespace.Lightning}
				<LightningNodesView
					entityFieldReference={{
						entityType: EntityType.LightningNetwork,
						selector: {
							$network: {
								networkSlug: network.fields.slug,
							},
						},
						fieldName: '$$nodes',
					}}
						href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes', {
							networkSlug: params.networkSlug,
						})}
					id="nodes"
				/>
			{:else}
				<p data-text="muted">This network does not expose a nodes route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
