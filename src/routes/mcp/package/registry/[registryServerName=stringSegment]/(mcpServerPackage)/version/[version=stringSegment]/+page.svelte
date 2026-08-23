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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.McpServerPackageVersion, {
		$package: data.selector,
		version: params.version,
	}, {
		sources: [
			Source.McpPackageRegistry_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpServerPackageVersionView from '$/views/McpServerPackageVersionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((pageSelection.entitySelector.version ?? '') || 'mcp server package version')} • mcp server package version • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'mcp server package version'} • mcp server package version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<McpServerPackageVersionView
		selection={pageSelection}
	/>
	{/if}
</Page>
