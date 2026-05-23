<script lang="ts">
	// Types/constants
	// Thin alias to LiquidityPoolView; keeps generic "Pool" routes typing narrow.
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			entityId: EntityId<typeof schema, EntityType.LiquidityPool>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof LiquidityPoolView>,
			| 'children'
			| 'entityId'
			| 'href'
			| 'open'
		>
	> = $props()


	// Components
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<LiquidityPoolView
	{children}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
/>
