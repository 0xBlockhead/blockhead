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
			label: 'staker',
		},
		{
			label: 'operator',
		},
		{
			label: 'strategy',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'staker',
				},
				{
					label: 'operator',
				},
				{
					label: 'strategy',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'delegated shares',
				},
			],
			[
				{
					label: 'underlying token amount',
				},
				{
					label: 'deposit root',
				},
				{
					label: 'withdrawal root',
				},
				{
					label: 'queued/completed flags',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Staker',
				items: [
					{
						label: 'staker EVM network account',
					},
				],
			},
			{
				label: 'Operator',
				items: [
					{
						label: 'EigenLayer operator',
					},
				],
			},
			{
				label: 'Strategy',
				items: [
					{
						label: 'EigenLayer strategy',
					},
				],
			},
			{
				label: 'Withdrawal lifecycle',
				items: [
					{
						label: 'queue/complete fields and transaction evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'DelegationManager/StrategyManager reads',
					},
					{
						label: 'deposit/withdrawal events',
					},
					{
						label: 'indexer freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerDelegation_Timestamp>
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
	entityType={EntityType.EigenLayerDelegation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
