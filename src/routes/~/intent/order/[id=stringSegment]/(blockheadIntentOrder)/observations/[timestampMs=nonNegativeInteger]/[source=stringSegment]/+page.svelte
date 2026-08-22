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

	const pageSelection = $derived(select(EntityType.BlockheadIntentOrder_Timestamp, {
		$order: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			status: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadIntentOrder_TimestampView from '$/views/BlockheadIntentOrder_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead intent order timestamp' : pageSelection.entity.status || 'blockhead intent order timestamp')} • blockhead intent order timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadIntentOrder_TimestampView
		selection={pageSelection}
	/>
</Page>
