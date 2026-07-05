<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
</script>


<svelte:head>
	<title>Governance • Blockhead</title>
</svelte:head>


<Page>
	<CosmosGovernanceProposalsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/governance', {
				networkSlug: params.networkSlug,
			})
		}
		title='Governance'
		selection={
			select(EntityType.CosmosNetwork, {
				$network: {
					slug: params.networkSlug,
				},
			})[EntityProxyField]<EntityType.CosmosGovernanceProposal>('$$governanceProposals')
		}
		id='governance-proposals'
	/>
</Page>
