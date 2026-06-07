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
			namespace: {},
			slug: {},
		},
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.namespace === NetworkNamespace.Cosmos}
				<CosmosGovernanceProposalsView
					entityFieldReference={{
						entityType: EntityType.CosmosNetwork,
						entityId: {
							networkSlug: network.slug,
						},
						fieldName: '$$governanceProposals',
					}}
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
