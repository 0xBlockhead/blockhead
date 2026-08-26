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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmNetworkActorCoinBalance_Timestamp, {
		$actorCoin: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalance_TimestampView from '$/views/EvmNetworkActorCoinBalance_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.source || 'EVM network actor coin balance timestamp')} • EVM network actor coin balance timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM network actor coin balance timestamp'} • EVM network actor coin balance timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmNetworkActorCoinBalance_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
