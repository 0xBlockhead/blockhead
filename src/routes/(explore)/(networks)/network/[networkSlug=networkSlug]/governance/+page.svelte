<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { Source } from '$/sources/Source.ts'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Governance • Blockhead</title>
</svelte:head>


<Page>
	<ResourceBoundary
		resource={select(EntityType.Network, {
			slug: params.networkSlug,
		})({
			sources: [
				Source.Constants_Internal,
			],
			fields: {
				caip2: true,
			},
		})}
	>
		{#snippet children(network)}
			{#if network.caip2.namespace === NetworkNamespace.Cosmos}
				<CosmosGovernanceProposalsView
					selection={select(EntityType.CosmosNetwork, {
						$network: {
							slug: params.networkSlug,
						},
					})[EntityProxyField]<EntityType.CosmosGovernanceProposal>('$$governanceProposals')({
						limit: 32,
					})}
					href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/governance', {
						networkSlug: params.networkSlug,
					})}
					id='governance'
					title='Governance'
				/>
			{:else}
				<p data-text='muted'>This network does not expose a governance route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
