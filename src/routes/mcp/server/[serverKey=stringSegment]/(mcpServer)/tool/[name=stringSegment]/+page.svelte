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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import McpToolView from '$/views/McpToolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpTool, {
					$server: data.selector,
					name: params.name,
				}, {
					sources: [
						Source.McpDeclared_Protocol,
					],
					fields: {
						title: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.name ?? '') || 'mcp tool' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.name || 'mcp tool')} • mcp tool • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'mcp tool'} • mcp tool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpTool, {
					$server: data.selector,
					name: params.name,
				}, {
					sources: [
						Source.McpDeclared_Protocol,
					],
					fields: {
						title: true,
					},
				}))}

		<McpToolView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
