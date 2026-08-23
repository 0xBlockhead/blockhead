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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpCanisterMethod_Timestamp, {
		$method: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpCanisterMethod_TimestampView from '$/views/IcpCanisterMethod_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP canister method timestamp'} • ICP canister method timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP canister method timestamp'} • ICP canister method timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpCanisterMethod_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
