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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosToken_Timestamp, {
		$token: data.selector,
		level: BigInt(params.level),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosToken_TimestampView from '$/views/TezosToken_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos token timestamp'} • tezos token timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos token timestamp'} • tezos token timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosToken_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
