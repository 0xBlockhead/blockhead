<!-- Generated from APP.ts. -->

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

	const pageSelection = $derived(select(EntityType.McpServerPackage, data.selector, {
		fields: {
			label: true,
			repositoryUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpServerPackageView from '$/views/McpServerPackageView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.registryServerName ?? '') || 'MCP server package' : (pageSelection.entity.label ?? '') || [(pageSelection.entitySelector.registryServerName ?? ''), (pageSelection.entity.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'MCP server package')} • MCP server package • Blockhead</title>
</svelte:head>


<Page>
	<McpServerPackageView
		selection={pageSelection}
	/>
</Page>
