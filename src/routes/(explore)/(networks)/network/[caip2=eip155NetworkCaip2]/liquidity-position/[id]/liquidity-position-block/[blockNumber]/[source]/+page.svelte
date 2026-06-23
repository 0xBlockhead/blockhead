<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPosition_BlockView from '$/views/LiquidityPosition_BlockView.svelte'
</script>


<Page>
	<LiquidityPosition_BlockView
		selection={select(EntityType.LiquidityPosition_Block, data.selector)}
	/>
</Page>
