<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPositionsView from '$/views/LiquidityPositionsView.svelte'
</script>


<Page>
	<LiquidityPositionsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$liquidityPositions',
		}}
		href={resolve('/~/accounts/positions')}
		id="positions"
	/>
</Page>
