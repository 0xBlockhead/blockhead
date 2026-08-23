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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosAccount_Timestamp, {
		$account: data.selector,
		level: BigInt(params.level),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosAccount_TimestampView from '$/views/TezosAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos account timestamp'} • tezos account timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos account timestamp'} • tezos account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosAccount_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
