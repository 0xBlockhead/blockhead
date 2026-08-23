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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMiner, data.selector, {
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.minerAddress || 'filecoin miner')} • filecoin miner • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin miner'} • filecoin miner • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMiner, data.selector, {
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
			})}

	<FilecoinMinerView
		selection={pageSelection}
	/>
	{/if}
</Page>
