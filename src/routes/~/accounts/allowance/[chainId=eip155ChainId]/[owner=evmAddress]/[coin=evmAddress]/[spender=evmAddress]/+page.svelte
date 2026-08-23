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
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmActorCoinAllowance, data.selector, {
				sources: [
					Source.EnvioHyperSync_RawHttp,
					Source.SqdPortal_RawHttp,
					Source.Voltaire_JsonRpc,
				],
			})}
		<title>{data?.title ?? 'allowance'} • allowance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'allowance'} • allowance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmActorCoinAllowance, data.selector, {
				sources: [
					Source.EnvioHyperSync_RawHttp,
					Source.SqdPortal_RawHttp,
					Source.Voltaire_JsonRpc,
				],
			})}

	<EvmActorCoinAllowanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
