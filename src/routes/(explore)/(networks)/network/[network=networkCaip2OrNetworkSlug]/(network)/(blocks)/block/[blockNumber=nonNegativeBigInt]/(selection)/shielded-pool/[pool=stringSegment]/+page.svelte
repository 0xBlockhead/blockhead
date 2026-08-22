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


	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedPoolBlockStateView from '$/views/ZcashShieldedPoolBlockStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'zcash shielded pool block state'} • zcash shielded pool block state • Blockhead</title>
</svelte:head>


<Page>
	<ZcashShieldedPoolBlockStateView
		selection={
			select(EntityType.ZcashShieldedPoolBlockState, {
				$block: data.selector,
				$pool: {
					$network: data.selector.$network,
					pool: params.pool,
				},
			})
		}
	/>
</Page>
