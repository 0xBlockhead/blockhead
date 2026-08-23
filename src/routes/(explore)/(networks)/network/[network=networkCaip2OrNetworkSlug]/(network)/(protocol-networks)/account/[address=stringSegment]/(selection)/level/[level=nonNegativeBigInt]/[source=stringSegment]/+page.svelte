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
	import TezosAccount_TimestampView from '$/views/TezosAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosAccount_Timestamp, {
					$account: data.selector,
					level: BigInt(params.level),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'tezos account timestamp'} • tezos account timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos account timestamp'} • tezos account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosAccount_Timestamp, {
					$account: data.selector,
					level: BigInt(params.level),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<TezosAccount_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
