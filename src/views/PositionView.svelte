<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPosition>
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
	selection={selection}
	bind:open
	{...EntityViewProps}
/>
