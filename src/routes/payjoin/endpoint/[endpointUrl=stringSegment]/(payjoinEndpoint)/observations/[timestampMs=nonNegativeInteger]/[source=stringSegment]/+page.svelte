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

	const pageSelection = $derived(select(EntityType.PayjoinEndpoint_Timestamp, {
		$endpoint: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PayjoinEndpoint_TimestampView from '$/views/PayjoinEndpoint_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'payjoin endpoint timestamp')} • payjoin endpoint timestamp • Blockhead</title>
</svelte:head>


<Page>
	<PayjoinEndpoint_TimestampView
		selection={pageSelection}
	/>
</Page>
