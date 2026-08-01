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

	const pageSelection = $derived(select(EntityType.MevRelay_Timestamp, {
		$relay: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$relay: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			reachable: true,
			statusCode: true,
			error: true,
			deliveredPayloadSampleCount: true,
			builderSampleCount: true,
			sampleLimit: true,
			windowStartSlot: true,
			windowEndSlot: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_TimestampView from '$/views/MevRelay_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'MEV relay timestamp' : [String(pageSelection.entity.reachable ?? ''), String(pageSelection.entity.statusCode ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'MEV relay timestamp')} • MEV relay timestamp • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_TimestampView
		selection={pageSelection}
	/>
</Page>
