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
	import McpResourceContent_TimestampView from '$/views/McpResourceContent_TimestampView.svelte'
</script>


<Page>
	<McpResourceContent_TimestampView
		selection={select(EntityType.McpResourceContent_Timestamp, data.selector)}
	/>
</Page>
