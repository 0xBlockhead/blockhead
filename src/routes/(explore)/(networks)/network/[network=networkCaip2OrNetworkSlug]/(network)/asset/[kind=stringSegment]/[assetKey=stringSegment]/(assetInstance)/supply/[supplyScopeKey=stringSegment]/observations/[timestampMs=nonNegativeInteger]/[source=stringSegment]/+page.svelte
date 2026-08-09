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

	const pageSelection = $derived(select(EntityType.AssetSupply_Timestamp, {
		$assetInstance: data.selector,
		supplyScopeKey: params.supplyScopeKey,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetSupply_TimestampView from '$/views/AssetSupply_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.supplyScopeKey || 'asset supply timestamp')} • asset supply timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AssetSupply_TimestampView
		selection={pageSelection}
	/>
</Page>
