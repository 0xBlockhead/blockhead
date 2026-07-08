<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


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
	<title>Cosmos governance proposals • Blockhead</title>
</svelte:head>


<Page>
	<CosmosGovernanceProposalsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance', {
				caip2: params.caip2,
			})
		}
		title='Cosmos governance proposals'
		selection={
			select(EntityType.Network, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			}).Cosmos.$$governanceProposals
		}
		id='governance-proposals'
	/>
</Page>
