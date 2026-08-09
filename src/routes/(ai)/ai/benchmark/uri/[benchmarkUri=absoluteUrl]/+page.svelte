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

	const pageSelection = $derived(select(EntityType.AiBenchmark, {
		benchmarkUri: decodeURIComponent(params.benchmarkUri),
	}, {
		fields: {
			label: true,
			benchmarkId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiBenchmarkView from '$/views/AiBenchmarkView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.benchmarkUri ?? '') || 'AI benchmark' : (pageSelection.entity.label ?? '') || [pageSelection.entity.benchmarkId, pageSelection.entitySelector.benchmarkUri].filter(Boolean).join(' ') || 'AI benchmark'} • AI benchmark • Blockhead</title>
</svelte:head>


<Page>
	<AiBenchmarkView
		selection={pageSelection}
	/>
</Page>
