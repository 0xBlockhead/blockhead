<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinTipset, {
				$network: data.selector,
				height: BigInt(params.height),
				tipsetKey: params.tipsetKey,
			}, {
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.height) || 'filecoin tipset')} • filecoin tipset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin tipset'} • filecoin tipset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinTipset, {
				$network: data.selector,
				height: BigInt(params.height),
				tipsetKey: params.tipsetKey,
			}, {
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
			})}

	<FilecoinTipsetView
		selection={pageSelection}
	/>
	{/if}
</Page>
