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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosBaker_Cycle_Timestamp, {
		$baker: data.selector,
		cycle: BigInt(params.cycle),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBaker_Cycle_TimestampView from '$/views/TezosBaker_Cycle_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos baker cycle timestamp'} • tezos baker cycle timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos baker cycle timestamp'} • tezos baker cycle timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosBaker_Cycle_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
