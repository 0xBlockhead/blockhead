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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.McpServer, data.selector, {
		sources: [
			Source.Eip8004Scan_Rest,
			Source.McpDeclared_Protocol,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.serverKey || 'mcp server')} • mcp server • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'mcp server'} • mcp server • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<McpServerView
		selection={pageSelection}
	/>
	{/if}
</Page>
