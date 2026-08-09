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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadEnsNameSearch, {
		query: params.query,
	}, {
		sources: [
			Source.Local_Internal,
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadEnsNameSearchView from '$/views/BlockheadEnsNameSearchView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.query || 'blockhead ENS name search'} • blockhead ENS name search • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadEnsNameSearchView
		selection={pageSelection}
	/>
</Page>
