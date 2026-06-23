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
	import StellarLiquidityPool_TimestampView from '$/views/StellarLiquidityPool_TimestampView.svelte'
</script>


<Page>
	<StellarLiquidityPool_TimestampView
		selection={select(EntityType.StellarLiquidityPool_Timestamp, data.selector)}
	/>
</Page>
