<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPositionsView from '$/views/LiquidityPositionsView.svelte'
</script>


<Page>
	<LiquidityPositionsView
		href={resolve('/leverage')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$liquidityPositions' },
			fieldName: '$$liquidityPositions',
		}}
		id="positions"
	/>
</Page>
