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
	import McpResourceView from '$/views/McpResourceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpResource, data.selector, {
					sources: [
						Source.McpDeclared_Protocol,
					],
					fields: {
						title: true,
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.uri ?? '') || 'mcp resource' : (pageSelection.entity.title ?? '') || [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.uri].filter(Boolean).join(' ') || 'mcp resource')} • mcp resource • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'mcp resource'} • mcp resource • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpResource, data.selector, {
					sources: [
						Source.McpDeclared_Protocol,
					],
					fields: {
						title: true,
						name: true,
					},
				}))}

		<McpResourceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
