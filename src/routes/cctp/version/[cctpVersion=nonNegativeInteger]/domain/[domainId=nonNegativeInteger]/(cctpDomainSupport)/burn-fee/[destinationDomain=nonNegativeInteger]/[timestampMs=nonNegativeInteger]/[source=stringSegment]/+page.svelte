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

	const pageSelection = $derived(select(EntityType.CctpBurnFee_Timestamp, {
		$sourceDomain: data.selector,
		$destinationDomain: {
			cctpVersion: selector.$sourceDomain.cctpVersion,
			domainId: Number(params.destinationDomain),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CctpBurnFee_TimestampView from '$/views/CctpBurnFee_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'CCTP burn fee timestamp')} • CCTP burn fee timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CctpBurnFee_TimestampView
		selection={pageSelection}
	/>
</Page>
