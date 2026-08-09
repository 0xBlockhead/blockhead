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


	// Components
	import Page from '$/components/Page.svelte'
	import CompoundPositionCollateralView from '$/views/CompoundPositionCollateralView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Compound position collateral'} • Compound position collateral • Blockhead</title>
</svelte:head>


<Page>
	<CompoundPositionCollateralView
		selection={
			select(EntityType.CompoundPositionCollateral, {
				$position: data.selector,
				$asset: {
					$comet: selector.$position.$comet,
					symbol: params.symbol,
				},
			}, {
				sources: [
					Source.Compound_Rest,
				],
			})
		}
	/>
</Page>
