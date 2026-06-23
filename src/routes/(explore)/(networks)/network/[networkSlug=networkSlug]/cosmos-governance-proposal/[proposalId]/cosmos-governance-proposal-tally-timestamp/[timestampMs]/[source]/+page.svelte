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
	import CosmosGovernanceProposalTally_TimestampView from '$/views/CosmosGovernanceProposalTally_TimestampView.svelte'
</script>


<Page>
	<CosmosGovernanceProposalTally_TimestampView
		selection={select(EntityType.CosmosGovernanceProposalTally_Timestamp, data.selector)}
	/>
</Page>
