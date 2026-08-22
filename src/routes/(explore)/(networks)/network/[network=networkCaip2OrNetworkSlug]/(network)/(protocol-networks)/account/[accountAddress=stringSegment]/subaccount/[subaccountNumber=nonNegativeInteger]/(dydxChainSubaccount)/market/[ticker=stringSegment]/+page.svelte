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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainPerpetualPositionView from '$/views/DydxChainPerpetualPositionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'dydx chain open perpetual position'} • dydx chain open perpetual position • Blockhead</title>
</svelte:head>


<Page>
	<DydxChainPerpetualPositionView
		selection={
			select(EntityType.DydxChainPerpetualPosition, data.selector, {
				sources: [
					Source.DydxIndexer,
				],
			})
		}
	/>
</Page>
