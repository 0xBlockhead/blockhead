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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandAsset_Timestamp, {
		$asset: data.selector,
		round: BigInt(params.round),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandAsset_TimestampView from '$/views/AlgorandAsset_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand asset timestamp'} • algorand asset timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand asset timestamp'} • algorand asset timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandAsset_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
