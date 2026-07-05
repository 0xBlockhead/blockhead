<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
	import CosmosGovernanceProposal_TimestampsView from '$/views/CosmosGovernanceProposal_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Cosmos governance proposal observations • Blockhead</title>
</svelte:head>


<Page>
	<CosmosGovernanceProposal_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]/observations', {
				caip2: params.caip2,
				proposalId: params.proposalId,
			})
		}
		title='Cosmos governance proposal observations'
		selection={
			select(EntityType.CosmosGovernanceProposal, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				proposalId: decodeURIComponent(params.proposalId),
			})[EntityProxyField]<EntityType.CosmosGovernanceProposal_Timestamp>('$$timestamps')
		}
		id='timestamps'
	/>
</Page>
