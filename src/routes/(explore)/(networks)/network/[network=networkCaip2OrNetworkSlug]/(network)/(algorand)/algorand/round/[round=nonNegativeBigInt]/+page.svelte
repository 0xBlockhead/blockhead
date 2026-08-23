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
	import AlgorandRoundView from '$/views/AlgorandRoundView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandRound, {
				$network: data.selector,
				round: BigInt(params.round),
			})}
		<title>{data?.title ?? 'algorand round'} • algorand round • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand round'} • algorand round • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandRound, {
				$network: data.selector,
				round: BigInt(params.round),
			})}

	<AlgorandRoundView
		selection={pageSelection}
	/>
	{/if}
</Page>
