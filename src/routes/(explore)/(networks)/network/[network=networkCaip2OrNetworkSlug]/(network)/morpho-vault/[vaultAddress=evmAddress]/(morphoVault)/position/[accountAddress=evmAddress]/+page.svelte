<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import MorphoVaultPositionView from '$/views/MorphoVaultPositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.MorphoVaultPosition, {
					$account: {
						$network: data.selector.$network,
						$actor: {
							address: params.accountAddress,
						},
					},
					$vault: data.selector,
				}, {
					sources: [
						Source.Morpho_Graphql,
					],
				}))}
			<title>{data?.title ?? 'Morpho vault position'} • Morpho vault position • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Morpho vault position'} • Morpho vault position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.MorphoVaultPosition, {
					$account: {
						$network: data.selector.$network,
						$actor: {
							address: params.accountAddress,
						},
					},
					$vault: data.selector,
				}, {
					sources: [
						Source.Morpho_Graphql,
					],
				}))}

		<MorphoVaultPositionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
