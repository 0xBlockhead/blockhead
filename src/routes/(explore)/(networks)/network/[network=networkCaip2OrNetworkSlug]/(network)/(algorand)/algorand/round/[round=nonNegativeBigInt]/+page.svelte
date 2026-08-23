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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandRound, {
		$network: data.selector,
		round: BigInt(params.round),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandRoundView from '$/views/AlgorandRoundView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand round'} • algorand round • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand round'} • algorand round • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandRoundView
		selection={pageSelection}
	/>
	{/if}
</Page>
