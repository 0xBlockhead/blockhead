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
	import McpToolCall_TimestampView from '$/views/McpToolCall_TimestampView.svelte'
</script>


<Page>
	<McpToolCall_TimestampView
		selection={select(EntityType.McpToolCall_Timestamp, data.selector)}
	/>
</Page>
