<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadQuilibriumAccountState_Timestamp, {
		$accountState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadQuilibriumAccountState_TimestampView from '$/views/BlockheadQuilibriumAccountState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead quilibrium account state timestamp')} • blockhead quilibrium account state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadQuilibriumAccountState_TimestampView
		selection={pageSelection}
	/>
</Page>
