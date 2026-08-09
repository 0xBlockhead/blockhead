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

	const pageSelection = $derived(select(EntityType.McpServerPackageVersion, {
		$artifact: data.selector,
	}, {
		sources: [
			Source.McpPackageRegistry_Rest,
		],
		fields: {
			version: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpServerPackageVersionView from '$/views/McpServerPackageVersionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'mcp server package version' : (pageSelection.entity.version ?? '') || 'mcp server package version')} • mcp server package version • Blockhead</title>
</svelte:head>


<Page>
	<McpServerPackageVersionView
		selection={pageSelection}
	/>
</Page>
