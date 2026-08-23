<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import McpToolCallView from '$/views/McpToolCallView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpToolCall, data.selector, {
					sources: [
						Source.McpDeclared_Protocol,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.callId || 'mcp tool call')} • mcp tool call • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'mcp tool call'} • mcp tool call • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpToolCall, data.selector, {
					sources: [
						Source.McpDeclared_Protocol,
					],
				}))}

		<McpToolCallView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
