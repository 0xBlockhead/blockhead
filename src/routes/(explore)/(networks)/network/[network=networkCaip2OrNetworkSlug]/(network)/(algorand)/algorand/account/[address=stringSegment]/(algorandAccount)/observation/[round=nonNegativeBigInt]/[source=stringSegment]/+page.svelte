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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandAccount_Timestamp, {
		$account: data.selector,
		round: BigInt(params.round),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandAccount_TimestampView from '$/views/AlgorandAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand account timestamp'} • algorand account timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand account timestamp'} • algorand account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandAccount_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
