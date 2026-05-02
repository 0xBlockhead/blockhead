<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
</script>


<Page>
	<LiquidityPoolsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$liquidityPools',
		}}
		href={resolve('/pools')}
		id="pools"
	/>
</Page>
