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

	const pageSelection = $derived(select(EntityType.MevBuilder_Timestamp, {
		$builder: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			deliveredPayloadCount: true,
			deliveredValueWei: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MevBuilder_TimestampView from '$/views/MevBuilder_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'MEV builder timestamp' : [(pageSelection.entity.deliveredPayloadCount != null ? String(pageSelection.entity.deliveredPayloadCount) + ' payloads' : ''), (pageSelection.entity.deliveredValueWei != null ? String(pageSelection.entity.deliveredValueWei) + ' wei' : '')].filter(Boolean).join(' ') || 'MEV builder timestamp')} • MEV builder timestamp • Blockhead</title>
</svelte:head>


<Page>
	<MevBuilder_TimestampView
		selection={pageSelection}
	/>
</Page>
