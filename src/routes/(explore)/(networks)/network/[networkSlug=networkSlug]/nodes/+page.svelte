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
		{
			networkSlug: params.networkSlug,
		},
		{
			$: [
				Source.Constants_Internal,
			],
			namespace: {},
			slug: {},
		},
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.namespace === NetworkNamespace.Lightning}
				<LightningNodesView
					entityFieldReference={{
						entityType: EntityType.LightningNetwork,
						entityId: {
							$network: {
								networkSlug: network.slug,
							},
						},
						fieldName: '$$nodes',
					}}
					href={`/network/${params.networkSlug}/nodes`}
					id="nodes"
				/>
			{:else}
				<p data-text="muted">This network does not expose a nodes route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
