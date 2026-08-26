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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosBigMap_Timestamp, {
		$bigMap: data.selector,
		level: BigInt(params.level),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBigMap_TimestampView from '$/views/TezosBigMap_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos big map timestamp'} • tezos big map timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos big map timestamp'} • tezos big map timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosBigMap_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
