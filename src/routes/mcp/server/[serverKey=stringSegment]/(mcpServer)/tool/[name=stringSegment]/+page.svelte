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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.McpTool, {
		$server: data.selector,
		name: params.name,
	}, {
		sources: [
			Source.McpDeclared_Protocol,
		],
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpToolView from '$/views/McpToolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.name ?? '') || 'mcp tool' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.name || 'mcp tool')} • mcp tool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'mcp tool'} • mcp tool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<McpToolView
		selection={pageSelection}
	/>
	{/if}
</Page>
