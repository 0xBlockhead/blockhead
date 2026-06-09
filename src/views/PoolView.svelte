<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LiquidityPool>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof LiquidityPoolView>,
			| 'href'
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<LiquidityPoolView
	{entityId}
	bind:open
	{...EntityViewProps}
/>
