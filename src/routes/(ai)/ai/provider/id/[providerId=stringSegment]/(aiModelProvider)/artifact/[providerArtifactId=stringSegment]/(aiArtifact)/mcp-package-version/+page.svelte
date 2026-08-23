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
	import McpServerPackageVersionView from '$/views/McpServerPackageVersionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpServerPackageVersion, {
					$artifact: data.selector,
				}, {
					sources: [
						Source.McpPackageRegistry_Rest,
					],
					fields: {
						version: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'mcp server package version' : (pageSelection.entity.version ?? '') || 'mcp server package version')} • mcp server package version • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'mcp server package version'} • mcp server package version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.McpServerPackageVersion, {
					$artifact: data.selector,
				}, {
					sources: [
						Source.McpPackageRegistry_Rest,
					],
					fields: {
						version: true,
					},
				}))}

		<McpServerPackageVersionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
