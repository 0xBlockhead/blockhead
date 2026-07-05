<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosGovernanceProposal_TimestampView from '$/views/CosmosGovernanceProposal_TimestampView.svelte'
</script>


<svelte:head>
	<title>Cosmos governance proposal timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CosmosGovernanceProposal_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				proposalId: params.proposalId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.CosmosGovernanceProposal_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					status: true,
					submitTimeMs: true,
					depositEndTimeMs: true,
					votingStartTimeMs: true,
					votingEndTimeMs: true,
					metadata: true,
				},
			})
		}
	/>
</Page>
