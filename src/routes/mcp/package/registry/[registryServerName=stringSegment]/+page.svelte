<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import McpServerPackageView from '$/views/McpServerPackageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpServerPackage, data.selector, {
					fields: {
						label: true,
						repositoryUrl: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.registryServerName ?? '') || 'MCP server package' : (pageSelection.entity.label ?? '') || [(pageSelection.entitySelector.registryServerName ?? ''), (pageSelection.entity.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'MCP server package')} • MCP server package • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'MCP server package'} • MCP server package • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpServerPackage, data.selector, {
					fields: {
						label: true,
						repositoryUrl: true,
					},
				}))}

		<McpServerPackageView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
