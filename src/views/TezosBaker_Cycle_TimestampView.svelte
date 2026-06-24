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
			label: 'baker',
		},
		'cycle',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'baker',
				},
				'cycle',
				'source',
				{
					label: 'snapshot level',
				},
				{
					label: 'staking balance',
				},
				{
					label: 'produced/missed blocks',
				},
				{
					label: 'endorsements',
				},
				{
					label: 'rewards',
				},
				{
					label: 'fees',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Baker',
				items: [
					{
						label: 'parent Tezos baker',
					},
				],
			},
			{
				label: 'Cycle',
				items: [
					{
						label: 'Tezos cycle',
					},
				],
			},
			{
				label: 'Rights',
				items: [
					{
						label: 'baking rights for baker/cycle',
					},
				],
			},
			{
				label: 'Performance',
				items: [
					{
						label: 'produced/missed blocks',
					},
					{
						label: 'endorsements',
					},
					{
						label: 'rewards',
					},
					{
						label: 'fees',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'rewards/performance payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBaker_Cycle_Timestamp>
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
	entityType={EntityType.TezosBaker_Cycle_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
