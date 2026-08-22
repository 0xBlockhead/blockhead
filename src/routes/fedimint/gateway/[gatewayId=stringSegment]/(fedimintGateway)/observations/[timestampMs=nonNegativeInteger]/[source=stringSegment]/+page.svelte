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

	const pageSelection = $derived(select(EntityType.FedimintGateway_Timestamp, {
		$gateway: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintGateway_TimestampView from '$/views/FedimintGateway_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Fedimint gateway timestamp')} • Fedimint gateway timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FedimintGateway_TimestampView
		selection={pageSelection}
	/>
</Page>
