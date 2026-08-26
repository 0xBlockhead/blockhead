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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PolkadotReferendum_Timestamp, {
		$referendum: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			status: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotReferendum_TimestampView from '$/views/PolkadotReferendum_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Polkadot referendum timestamp' : (pageSelection.entity.status ?? '') || 'Polkadot referendum timestamp')} • Polkadot referendum timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot referendum timestamp'} • Polkadot referendum timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PolkadotReferendum_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
