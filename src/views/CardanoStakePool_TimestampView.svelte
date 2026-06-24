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
			label: 'pool',
		},
		'epoch',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'pool',
				},
				'epoch',
				'source',
				{
					label: 'observation time',
				},
				'slot',
				'pledge',
				'margin',
				{
					label: 'fixed cost',
				},
				{
					label: 'reward account',
				},
				{
					label: 'owner count',
				},
				{
					label: 'metadata URL/hash',
				},
			],
			[
				{
					label: 'live/active stake',
				},
				{
					label: 'delegator count',
				},
				{
					label: 'block count',
				},
				'saturation',
				{
					label: 'retired flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Stake pool',
				items: [
					{
						label: 'CardanoStakePool',
					},
				],
			},
			{
				label: 'Registration/economics',
				items: [
					'pledge',
					'margin',
					{
						label: 'fixed cost',
					},
					{
						label: 'reward account',
					},
					'owners',
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'metadata URL',
					},
					{
						label: 'metadata hash',
					},
				],
			},
			{
				label: 'Performance/stake',
				items: [
					{
						label: 'live/active stake',
					},
					{
						label: 'delegator count',
					},
					{
						label: 'block count',
					},
					'saturation',
					{
						label: 'retired flag',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'epoch-scoped pool payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoStakePool_Timestamp>
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
	entityType={EntityType.CardanoStakePool_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
