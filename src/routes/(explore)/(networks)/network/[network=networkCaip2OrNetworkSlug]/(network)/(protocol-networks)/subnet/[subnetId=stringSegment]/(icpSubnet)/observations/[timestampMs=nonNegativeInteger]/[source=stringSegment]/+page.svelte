<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import IcpSubnet_TimestampView from '$/views/IcpSubnet_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.IcpSubnet_Timestamp, {
					$subnet: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'ICP subnet timestamp'} • ICP subnet timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ICP subnet timestamp'} • ICP subnet timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.IcpSubnet_Timestamp, {
					$subnet: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<IcpSubnet_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
