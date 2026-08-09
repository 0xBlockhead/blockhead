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

	const pageSelection = $derived(select(EntityType.BlockheadFedimintClientState_Timestamp, {
		$clientState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFedimintClientState_TimestampView from '$/views/BlockheadFedimintClientState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead Fedimint client state timestamp')} • blockhead Fedimint client state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadFedimintClientState_TimestampView
		selection={pageSelection}
	/>
</Page>
