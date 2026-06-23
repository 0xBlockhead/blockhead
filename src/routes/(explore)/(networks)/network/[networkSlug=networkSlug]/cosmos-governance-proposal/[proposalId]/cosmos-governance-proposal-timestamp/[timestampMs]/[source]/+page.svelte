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
	import CosmosGovernanceProposal_TimestampView from '$/views/CosmosGovernanceProposal_TimestampView.svelte'
</script>


<Page>
	<CosmosGovernanceProposal_TimestampView
		selection={select(EntityType.CosmosGovernanceProposal_Timestamp, data.selector)}
	/>
</Page>
