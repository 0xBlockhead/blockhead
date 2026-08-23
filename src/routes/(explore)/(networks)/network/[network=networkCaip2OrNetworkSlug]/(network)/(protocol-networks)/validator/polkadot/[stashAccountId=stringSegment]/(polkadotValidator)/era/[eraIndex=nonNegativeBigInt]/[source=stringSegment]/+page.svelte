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
	import PolkadotValidator_EraView from '$/views/PolkadotValidator_EraView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotValidator_Era, {
					$validator: data.selector,
					eraIndex: BigInt(params.eraIndex),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.eraIndex) || 'polkadot validator era')} • polkadot validator era • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'polkadot validator era'} • polkadot validator era • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotValidator_Era, {
					$validator: data.selector,
					eraIndex: BigInt(params.eraIndex),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<PolkadotValidator_EraView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
