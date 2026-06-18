<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
</script>


<Page>
	<LiquidityPoolsView
		href={resolve('/pools')}
		selection={select(
			EntityType._Global,
			{ scope: '$$liquidityPools' }
		).$$liquidityPools}
		id="pools"
	/>
</Page>
