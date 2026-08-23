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
	import McpPromptView from '$/views/McpPromptView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpPrompt, data.selector, {
					sources: [
						Source.McpDeclared_Protocol,
					],
					fields: {
						title: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.name ?? '') || 'mcp prompt' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.name || 'mcp prompt')} • mcp prompt • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'mcp prompt'} • mcp prompt • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpPrompt, data.selector, {
					sources: [
						Source.McpDeclared_Protocol,
					],
					fields: {
						title: true,
					},
				}))}

		<McpPromptView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
