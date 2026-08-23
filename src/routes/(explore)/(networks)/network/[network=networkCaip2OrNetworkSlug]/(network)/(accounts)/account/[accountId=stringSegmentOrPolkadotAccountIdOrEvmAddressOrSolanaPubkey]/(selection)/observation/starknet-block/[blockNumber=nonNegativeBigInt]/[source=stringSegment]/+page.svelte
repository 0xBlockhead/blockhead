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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StarknetAccount_Timestamp, {
		$contract: data.selector,
		blockNumber: BigInt(params.blockNumber),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetAccount_TimestampView from '$/views/StarknetAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'starknet account timestamp'} • starknet account timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet account timestamp'} • starknet account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StarknetAccount_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
