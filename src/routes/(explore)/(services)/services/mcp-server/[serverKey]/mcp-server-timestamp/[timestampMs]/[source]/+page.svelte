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
	import McpServer_TimestampView from '$/views/McpServer_TimestampView.svelte'
</script>


<Page>
	<McpServer_TimestampView
		selection={select(EntityType.McpServer_Timestamp, data.selector)}
	/>
</Page>
