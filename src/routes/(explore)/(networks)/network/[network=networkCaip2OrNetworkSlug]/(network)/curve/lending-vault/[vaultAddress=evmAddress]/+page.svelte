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
	import CurveLendingVaultView from '$/views/CurveLendingVaultView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CurveLendingVault, {
					$network: data.selector,
					vaultAddress: params.vaultAddress,
				}, {
					sources: [
						Source.Curve_Rest,
					],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Curve Lend vault' : pageSelection.entity.name || 'Curve Lend vault')} • Curve Lend vault • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Curve Lend vault'} • Curve Lend vault • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CurveLendingVault, {
					$network: data.selector,
					vaultAddress: params.vaultAddress,
				}, {
					sources: [
						Source.Curve_Rest,
					],
					fields: {
						name: true,
					},
				}))}

		<CurveLendingVaultView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
