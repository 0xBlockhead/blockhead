<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.McpServerPackage, data.selector, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.registryServerName ?? '') || 'MCP server package' : (pageSelection.entity.label ?? '') || [(pageSelection.entitySelector.registryServerName ?? ''), (pageSelection.entity.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'MCP server package')} • MCP server package • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'MCP server package'} • MCP server package • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<McpServerPackageView
		selection={pageSelection}
	/>
	{/if}
</Page>
