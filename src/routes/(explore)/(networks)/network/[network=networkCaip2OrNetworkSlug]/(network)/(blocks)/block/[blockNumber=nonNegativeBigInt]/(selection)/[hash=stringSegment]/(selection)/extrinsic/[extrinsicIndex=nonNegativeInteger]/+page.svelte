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
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotExtrinsic, {
					$block: data.selector,
					indexInBlock: Number(params.extrinsicIndex),
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInBlock ?? '') ? 'Extrinsic #' + String(pageSelection.entitySelector.indexInBlock ?? '') : '') || 'Polkadot extrinsic')} • Polkadot extrinsic • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Polkadot extrinsic'} • Polkadot extrinsic • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotExtrinsic, {
					$block: data.selector,
					indexInBlock: Number(params.extrinsicIndex),
				}))}

		<PolkadotExtrinsicView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
