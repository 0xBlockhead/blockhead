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

	const pageSelection = $derived(select(EntityType.McpServer, data.selector, {
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
	<title>{data.title ?? (pageSelection.entitySelector.serverKey || 'mcp server')} • mcp server • Blockhead</title>
</svelte:head>


<Page>
	<McpServerView
		selection={pageSelection}
	/>
</Page>
