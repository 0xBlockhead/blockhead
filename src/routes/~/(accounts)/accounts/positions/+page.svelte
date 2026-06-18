<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPositionsView from '$/views/LiquidityPositionsView.svelte'
</script>


<Page>
	<LiquidityPositionsView
		href={resolve('/leverage')}
		selection={select(
			EntityType._Global,
			{ scope: '$$liquidityPositions' }
		).$$liquidityPositions}
		id="positions"
	/>
</Page>
