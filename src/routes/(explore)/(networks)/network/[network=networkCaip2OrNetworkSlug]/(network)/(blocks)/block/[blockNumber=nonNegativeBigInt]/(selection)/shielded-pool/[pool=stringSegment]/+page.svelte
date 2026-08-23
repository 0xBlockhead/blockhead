<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ZcashShieldedPoolBlockState, {
		$block: data.selector,
		$pool: {
			$network: data.selector.$network,
			pool: params.pool,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedPoolBlockStateView from '$/views/ZcashShieldedPoolBlockStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'zcash shielded pool block state'} • zcash shielded pool block state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zcash shielded pool block state'} • zcash shielded pool block state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ZcashShieldedPoolBlockStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
