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
	import AcpAgentRuntime_TimestampView from '$/views/AcpAgentRuntime_TimestampView.svelte'
</script>


<Page>
	<AcpAgentRuntime_TimestampView
		selection={select(EntityType.AcpAgentRuntime_Timestamp, data.selector)}
	/>
</Page>
