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
		'cycle',
		{
			label: 'first/last level',
		},
		{
			label: 'snapshot level',
		},
	],
	content: {
		dl: [
			[
				'cycle',
				{
					label: 'first/last level',
				},
				{
					label: 'snapshot level',
				},
				{
					label: 'random seed presence',
				},
				{
					label: 'baker count',
				},
				{
					label: 'rights count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Bakers',
				items: [
					{
						label: 'cycle-bounded baker observations',
					},
				],
			},
			{
				label: 'Rights',
				items: [
					{
						label: 'baking/attestation rights in this cycle',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'blocks filtered by cycle',
					},
				],
			},
			{
				label: 'Rewards/statistics',
				items: [
					{
						label: 'cycle reward',
					},
					{
						label: 'baker performance rows',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'cycle payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosCycle>
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
	entityType={EntityType.TezosCycle}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
