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

	const pageSelection = $derived(select(EntityType.BlockheadActionOutcome_Timestamp, {
		$outcome: data.selector,
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
	import BlockheadActionOutcome_TimestampView from '$/views/BlockheadActionOutcome_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'blockhead action outcome timestamp' : pageSelection.entity.status || 'blockhead action outcome timestamp')} • blockhead action outcome timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadActionOutcome_TimestampView
		selection={pageSelection}
	/>
</Page>
