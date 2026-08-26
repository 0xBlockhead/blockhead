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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TransferRestrictionCheck_Timestamp, {
		$restriction: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
		subjectKey: params.subjectKey,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TransferRestrictionCheck_TimestampView from '$/views/TransferRestrictionCheck_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'transfer restriction check timestamp'} • transfer restriction check timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'transfer restriction check timestamp'} • transfer restriction check timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TransferRestrictionCheck_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
