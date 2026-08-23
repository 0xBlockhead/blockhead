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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import McpServerPackageVersionView from '$/views/McpServerPackageVersionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.McpServerPackageVersion, {
				$package: data.selector,
				version: params.version,
			}, {
				sources: [
					Source.McpPackageRegistry_Rest,
				],
			})}
		<title>{data?.title ?? ((pageSelection.entitySelector.version ?? '') || 'mcp server package version')} • mcp server package version • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'mcp server package version'} • mcp server package version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.McpServerPackageVersion, {
				$package: data.selector,
				version: params.version,
			}, {
				sources: [
					Source.McpPackageRegistry_Rest,
				],
			})}

	<McpServerPackageVersionView
		selection={pageSelection}
	/>
	{/if}
</Page>
