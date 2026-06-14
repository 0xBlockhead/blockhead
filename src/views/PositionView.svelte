<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.LiquidityPosition>
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
	{selector}
	bind:open
	{...EntityViewProps}
/>
