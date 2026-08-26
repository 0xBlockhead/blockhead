<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.McpPrompt, data.selector, {
		sources: [
			Source.McpDeclared_Protocol,
		],
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpPromptView from '$/views/McpPromptView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.name ?? '') || 'mcp prompt' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.name || 'mcp prompt')} • mcp prompt • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'mcp prompt'} • mcp prompt • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<McpPromptView
		selection={pageSelection}
	/>
	{/if}
</Page>
