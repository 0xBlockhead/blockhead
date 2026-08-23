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


	// Components
	import Page from '$/components/Page.svelte'
	import IcpCanisterLog_TimestampView from '$/views/IcpCanisterLog_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpCanisterLog_Timestamp, {
				$canister: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'ICP canister log timestamp'} • ICP canister log timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP canister log timestamp'} • ICP canister log timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpCanisterLog_Timestamp, {
				$canister: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<IcpCanisterLog_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
