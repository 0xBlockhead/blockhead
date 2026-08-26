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
		source: params.source,
		sourceBenchmarkId: params.sourceBenchmarkId,
	}, {
		sources: [params.source],
		fields: {
			label: true,
			benchmarkId: true,
			benchmarkUri: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiBenchmarkView from '$/views/AiBenchmarkView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'AI benchmark' : (pageSelection.entity.label ?? '') || [(pageSelection.entity.benchmarkId ?? ''), (pageSelection.entity.benchmarkUri ?? '')].filter(Boolean).join(' ') || 'AI benchmark'} • AI benchmark • Blockhead</title>
</svelte:head>


<Page>
	<AiBenchmarkView
		selection={pageSelection}
	/>
</Page>
