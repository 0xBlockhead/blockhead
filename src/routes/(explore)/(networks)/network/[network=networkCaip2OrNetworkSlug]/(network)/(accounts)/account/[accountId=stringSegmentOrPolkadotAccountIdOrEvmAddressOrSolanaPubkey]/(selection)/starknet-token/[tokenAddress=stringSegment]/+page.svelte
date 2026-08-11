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
	import StarknetTokenHoldingView from '$/views/StarknetTokenHoldingView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'starknet token holding'} • starknet token holding • Blockhead</title>
</svelte:head>


<Page>
	<StarknetTokenHoldingView
		selection={
			select(EntityType.StarknetTokenHolding, data.selector, {
				sources: [
					Source.Starkscan,
				],
			})
		}
	/>
</Page>
