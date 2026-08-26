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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ZeroGNetwork_Timestamp, {
		$network: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGNetwork_TimestampView from '$/views/ZeroGNetwork_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'zero g network timestamp'} • zero g network timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g network timestamp'} • zero g network timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ZeroGNetwork_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
