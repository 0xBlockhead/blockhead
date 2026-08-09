<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.McpServerPackage, {
		repositoryUrl: decodeURIComponent(params.repositoryUrl),
	}, {
		fields: {
			label: true,
			registryServerName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpServerPackageView from '$/views/McpServerPackageView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.repositoryUrl ?? '') || 'MCP server package' : (pageSelection.entity.label ?? '') || [pageSelection.entity.registryServerName, pageSelection.entitySelector.repositoryUrl].filter(Boolean).join(' ') || 'MCP server package'} • MCP server package • Blockhead</title>
</svelte:head>


<Page>
	<McpServerPackageView
		selection={pageSelection}
	/>
</Page>
