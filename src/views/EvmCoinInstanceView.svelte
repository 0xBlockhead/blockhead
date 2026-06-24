<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'icon',
		},
		{
			label: 'symbol/name fallback',
		},
		{
			label: 'chain',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'icon',
				},
				{
					label: 'symbol/name fallback',
				},
				{
					label: 'chain',
				},
				{
					label: 'native/token contract kind',
				},
				'name',
				'symbol',
				'decimals',
				{
					label: 'CAIP-19',
				},
				'representation',
				{
					label: 'canonical deployment',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Bridging',
				items: [
					{
						label: 'outbound/inbound bridge capability rows',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmCoinInstance>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.EvmCoinInstance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
