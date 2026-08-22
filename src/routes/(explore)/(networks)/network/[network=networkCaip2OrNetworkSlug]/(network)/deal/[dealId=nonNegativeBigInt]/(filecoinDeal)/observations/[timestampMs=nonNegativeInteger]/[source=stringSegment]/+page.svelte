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

	const pageSelection = $derived(select(EntityType.FilecoinDeal_Timestamp, {
		$deal: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinDeal_TimestampView from '$/views/FilecoinDeal_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'filecoin deal timestamp')} • filecoin deal timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinDeal_TimestampView
		selection={pageSelection}
	/>
</Page>
