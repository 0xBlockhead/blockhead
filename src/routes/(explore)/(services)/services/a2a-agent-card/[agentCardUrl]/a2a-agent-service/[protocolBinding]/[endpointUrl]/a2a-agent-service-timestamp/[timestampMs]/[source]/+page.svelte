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
	import A2aAgentService_TimestampView from '$/views/A2aAgentService_TimestampView.svelte'
</script>


<Page>
	<A2aAgentService_TimestampView
		selection={select(EntityType.A2aAgentService_Timestamp, data.selector)}
	/>
</Page>
