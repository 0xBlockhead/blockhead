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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpCanisterLog_Timestamp, {
		$canister: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpCanisterLog_TimestampView from '$/views/IcpCanisterLog_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP canister log timestamp'} • ICP canister log timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP canister log timestamp'} • ICP canister log timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpCanisterLog_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
