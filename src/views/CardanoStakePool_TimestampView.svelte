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
		'$pool',
		'epoch',
		'source',
	],
	content: {
		dl: [
			[
				'$pool',
				'epoch',
				'source',
				'timestampMs',
				'slot',
			],
			[
				'pledge',
				'margin',
				'fixedCostLovelace',
				'rewardAccount',
				'owners',
			],
			[
				{
					label: 'metadata URL/hash',
				},
			],
			[
				{
					label: 'live/active stake',
				},
				'delegatorCount',
				'blockCount',
				'saturation',
				'retired',
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
					'fixedCostLovelace',
					'rewardAccount',
					'owners',
				],
			},
			{
				label: 'Metadata',
				items: [
					'metadataUrl',
					'metadataHash',
				],
			},
			{
				label: 'Performance/stake',
				items: [
					{
						label: 'live/active stake',
					},
					'delegatorCount',
					'blockCount',
					'saturation',
					'retired',
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
