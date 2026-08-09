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

	const pageSelection = $derived(select(EntityType.AssetFormatSupport_Timestamp, {
		$assetInstance: data.selector,
		formatId: params.formatId,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetFormatSupport_TimestampView from '$/views/AssetFormatSupport_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.formatId || 'asset format support timestamp')} • asset format support timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AssetFormatSupport_TimestampView
		selection={pageSelection}
	/>
</Page>
