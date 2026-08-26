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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosContract_Timestamp, {
		$contract: data.selector,
		level: BigInt(params.level),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosContract_TimestampView from '$/views/TezosContract_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos contract timestamp'} • tezos contract timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos contract timestamp'} • tezos contract timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosContract_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
