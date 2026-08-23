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
	import TezosCycleView from '$/views/TezosCycleView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosCycle, {
					$network: data.selector,
					cycle: BigInt(params.cycle),
				}))}
			<title>{data?.title ?? 'tezos cycle'} • tezos cycle • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos cycle'} • tezos cycle • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosCycle, {
					$network: data.selector,
					cycle: BigInt(params.cycle),
				}))}

		<TezosCycleView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
