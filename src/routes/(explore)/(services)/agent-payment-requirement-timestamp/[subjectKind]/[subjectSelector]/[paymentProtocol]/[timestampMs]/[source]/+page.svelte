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
	import AgentPaymentRequirement_TimestampView from '$/views/AgentPaymentRequirement_TimestampView.svelte'
</script>


<Page>
	<AgentPaymentRequirement_TimestampView
		selection={select(EntityType.AgentPaymentRequirement_Timestamp, data.selector)}
	/>
</Page>
