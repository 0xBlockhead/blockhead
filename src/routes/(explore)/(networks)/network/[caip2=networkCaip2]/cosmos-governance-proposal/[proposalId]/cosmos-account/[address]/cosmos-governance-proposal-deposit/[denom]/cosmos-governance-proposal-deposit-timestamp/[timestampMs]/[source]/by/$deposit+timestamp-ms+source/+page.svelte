<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosGovernanceProposalDeposit_TimestampView from '$/views/CosmosGovernanceProposalDeposit_TimestampView.svelte'
</script>


<Page>
	<CosmosGovernanceProposalDeposit_TimestampView
		selection={select(EntityType.CosmosGovernanceProposalDeposit_Timestamp, data.selector)}
	/>
</Page>
