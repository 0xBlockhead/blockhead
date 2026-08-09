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
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'dydx chain subaccount'} • dydx chain subaccount • Blockhead</title>
</svelte:head>


<Page>
	<DydxChainSubaccountView
		selection={
			select(EntityType.DydxChainSubaccount, data.selector, {
				sources: [
					Source.DydxIndexer,
					Source.KingnodesDydxNode,
				],
			})
		}
	/>
</Page>
