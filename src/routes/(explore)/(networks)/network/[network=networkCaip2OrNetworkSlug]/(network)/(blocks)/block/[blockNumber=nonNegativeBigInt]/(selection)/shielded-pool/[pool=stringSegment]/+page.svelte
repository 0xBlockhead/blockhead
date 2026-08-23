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
	import ZcashShieldedPoolBlockStateView from '$/views/ZcashShieldedPoolBlockStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZcashShieldedPoolBlockState, {
					$block: data.selector,
					$pool: {
						$network: data.selector.$network,
						pool: params.pool,
					},
				}))}
			<title>{data?.title ?? 'zcash shielded pool block state'} • zcash shielded pool block state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'zcash shielded pool block state'} • zcash shielded pool block state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZcashShieldedPoolBlockState, {
					$block: data.selector,
					$pool: {
						$network: data.selector.$network,
						pool: params.pool,
					},
				}))}

		<ZcashShieldedPoolBlockStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
