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

	const pageSelection = $derived(select(EntityType.AaveReservePosition, {
		$account: data.selector,
		poolAddress: params.poolAddress,
		underlyingTokenAddress: params.underlyingTokenAddress,
	}, {
		sources: [
			Source.Aave_Rest,
		],
		fields: {
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AaveReservePositionView from '$/views/AaveReservePositionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Aave reserve position' : pageSelection.entity.symbol || 'Aave reserve position')} • Aave reserve position • Blockhead</title>
</svelte:head>


<Page>
	<AaveReservePositionView
		selection={pageSelection}
	/>
</Page>
