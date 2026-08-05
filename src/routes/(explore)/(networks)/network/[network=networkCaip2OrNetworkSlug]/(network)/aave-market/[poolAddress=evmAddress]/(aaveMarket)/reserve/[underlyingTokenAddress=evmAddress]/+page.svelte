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

	const pageSelection = $derived(select(EntityType.AaveReserve, {
		$market: data.selector,
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
	import AaveReserveView from '$/views/AaveReserveView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Aave reserve' : pageSelection.entity.symbol || 'Aave reserve')} • Aave reserve • Blockhead</title>
</svelte:head>


<Page>
	<AaveReserveView
		selection={pageSelection}
	/>
</Page>
