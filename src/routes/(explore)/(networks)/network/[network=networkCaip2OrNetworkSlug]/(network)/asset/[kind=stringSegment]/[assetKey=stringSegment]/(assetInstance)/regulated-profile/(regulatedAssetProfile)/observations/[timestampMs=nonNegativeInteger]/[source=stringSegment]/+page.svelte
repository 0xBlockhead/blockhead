<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RegulatedAssetProfile_Timestamp, {
		$profile: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RegulatedAssetProfile_TimestampView from '$/views/RegulatedAssetProfile_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'regulated asset profile timestamp'} • regulated asset profile timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'regulated asset profile timestamp'} • regulated asset profile timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RegulatedAssetProfile_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
