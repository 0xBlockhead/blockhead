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
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool>
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
	selection={selection}
	bind:open
	{...EntityViewProps}
/>
