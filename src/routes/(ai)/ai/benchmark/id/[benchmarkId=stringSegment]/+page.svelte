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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AiBenchmark, {
		benchmarkId: params.benchmarkId,
	}, {
		fields: {
			label: true,
			benchmarkUri: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiBenchmarkView from '$/views/AiBenchmarkView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.benchmarkId ?? '') || 'AI benchmark' : (pageSelection.entity.label ?? '') || [(pageSelection.entitySelector.benchmarkId ?? ''), (pageSelection.entity.benchmarkUri ?? '')].filter(Boolean).join(' ') || 'AI benchmark'} • AI benchmark • Blockhead</title>
</svelte:head>


<Page>
	<AiBenchmarkView
		selection={pageSelection}
	/>
</Page>
