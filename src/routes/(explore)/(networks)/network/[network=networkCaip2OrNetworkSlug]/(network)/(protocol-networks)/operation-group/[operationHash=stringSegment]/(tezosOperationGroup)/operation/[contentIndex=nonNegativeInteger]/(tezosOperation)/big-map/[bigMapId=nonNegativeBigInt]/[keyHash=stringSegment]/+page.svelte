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
	import TezosBigMapDiffView from '$/views/TezosBigMapDiffView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBigMapDiff, {
					$operation: data.selector,
					bigMapId: BigInt(params.bigMapId),
					keyHash: params.keyHash,
				}))}
			<title>{data?.title ?? 'tezos big map diff'} • tezos big map diff • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos big map diff'} • tezos big map diff • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBigMapDiff, {
					$operation: data.selector,
					bigMapId: BigInt(params.bigMapId),
					keyHash: params.keyHash,
				}))}

		<TezosBigMapDiffView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
