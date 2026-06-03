<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LiquidityPosition>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof LiquidityPositionView>,
			| 'href'
			| 'layout'
		>
	> = $props()


	// Components
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<LiquidityPositionView
	{entityId}
	bind:open
	{...EntityViewProps}
/>
