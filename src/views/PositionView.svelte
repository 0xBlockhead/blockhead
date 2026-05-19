<script lang="ts">
	// Types/constants
	// Thin alias to LiquidityPositionView; keeps generic "Position" routes typing narrow.
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Components
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.LiquidityPosition>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof LiquidityPositionView>,
			| 'children'
			| 'entityId'
			| 'href'
			| 'open'
		>
	> = $props()
</script>


<LiquidityPositionView
	{children}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
/>
