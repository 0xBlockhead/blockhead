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

	const pageSelection = $derived(select(EntityType.PolkadotReferendum_Timestamp, {
		$referendum: data.selector,
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
	import PolkadotReferendum_TimestampView from '$/views/PolkadotReferendum_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Polkadot referendum timestamp' : (pageSelection.entity.status ?? '') || 'Polkadot referendum timestamp')} • Polkadot referendum timestamp • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotReferendum_TimestampView
		selection={pageSelection}
	/>
</Page>
