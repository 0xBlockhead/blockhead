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

	const pageSelection = $derived(select(EntityType.EasSchema, {
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
	<title>{data?.title ?? (pageSelection.entitySelector.schemaUid || 'EAS schema')} • EAS schema • Blockhead</title>
</svelte:head>


<Page>
	<EasSchemaView
		selection={pageSelection}
	/>
</Page>
