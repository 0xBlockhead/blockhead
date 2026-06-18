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
			], fields: { namespace: true, slug: true } }),
	))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.fields.namespace === NetworkNamespace.Cosmos}
				<CosmosGovernanceProposalsView
					selection={select(
						EntityType.CosmosNetwork,
						{
							$network: {
								slug: network.fields.slug,
							},
						}
					).$$governanceProposals({
						sources: [
							Source.CosmosSdk_Rest,
						],
						limit: 32,
					})}
					href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/governance', {
						networkSlug: params.networkSlug,
					})}
					id="governance"
					title="Governance"
				/>
			{:else}
				<p data-text="muted">This network does not expose a governance route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
