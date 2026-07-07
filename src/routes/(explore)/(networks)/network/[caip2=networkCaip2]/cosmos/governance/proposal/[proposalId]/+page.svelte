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
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
</script>


<Page>
	<CosmosGovernanceProposalView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]', {
				caip2: params.caip2,
				proposalId: params.proposalId,
			})
		}
		selection={
			select(EntityType.CosmosGovernanceProposal, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				proposalId: decodeURIComponent(params.proposalId),
			}, {
				fields: {
					title: true,
					metadata: true,
					summary: true,
				},
			})
		}
	/>
</Page>
