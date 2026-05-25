<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Props
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LiquidityPosition>
			open?: boolean
		},
		never
	> = $props()


	// Components
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<LiquidityPositionView
	{children}
	{entityId}
	bind:open
	{...EntityViewProps}
/>
