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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EasSchema, {
		$network: data.selector,
		schemaUid: params.schemaUid,
	}, {
		sources: [
			Source.EasScan_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EasSchemaView from '$/views/EasSchemaView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.schemaUid || 'EAS schema')} • EAS schema • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EAS schema'} • EAS schema • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EasSchemaView
		selection={pageSelection}
	/>
	{/if}
</Page>
