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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CurveLendingVault, {
		$network: data.selector,
		vaultAddress: params.vaultAddress,
	}, {
		sources: [
			Source.Curve_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CurveLendingVaultView from '$/views/CurveLendingVaultView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Curve Lend vault' : pageSelection.entity.name || 'Curve Lend vault')} • Curve Lend vault • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Curve Lend vault'} • Curve Lend vault • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CurveLendingVaultView
		selection={pageSelection}
	/>
	{/if}
</Page>
