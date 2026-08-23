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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBakingRightView from '$/views/TezosBakingRightView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBakingRight, data.selector, {
					sources: [data.selector.source],
				}))}
			<title>{data?.title ?? 'tezos baking right'} • tezos baking right • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos baking right'} • tezos baking right • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBakingRight, data.selector, {
					sources: [data.selector.source],
				}))}

		<TezosBakingRightView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
