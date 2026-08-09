<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.McpToolCall, data.selector, {
		sources: [
			Source.McpDeclared_Protocol,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpToolCallView from '$/views/McpToolCallView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.callId || 'mcp tool call')} • mcp tool call • Blockhead</title>
</svelte:head>


<Page>
	<McpToolCallView
		selection={pageSelection}
	/>
</Page>
