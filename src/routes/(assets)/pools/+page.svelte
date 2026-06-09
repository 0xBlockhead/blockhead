<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$liquidityPools' },
			fieldName: '$$liquidityPools',
		}}
		id="pools"
	/>
</Page>
