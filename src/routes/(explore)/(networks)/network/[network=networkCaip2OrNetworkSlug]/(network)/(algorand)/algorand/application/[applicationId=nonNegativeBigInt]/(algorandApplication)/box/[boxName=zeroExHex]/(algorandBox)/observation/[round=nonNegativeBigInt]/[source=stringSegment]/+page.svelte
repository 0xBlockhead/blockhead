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
	import AlgorandBox_RoundView from '$/views/AlgorandBox_RoundView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AlgorandBox_Round, {
					$box: data.selector,
					round: BigInt(params.round),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'algorand box round'} • algorand box round • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'algorand box round'} • algorand box round • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AlgorandBox_Round, {
					$box: data.selector,
					round: BigInt(params.round),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<AlgorandBox_RoundView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
