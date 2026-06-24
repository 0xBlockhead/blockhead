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
			label: 'operator',
		},
		{
			label: 'AVS',
		},
		{
			label: 'slashed shares',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'operator',
				},
				{
					label: 'AVS',
				},
				{
					label: 'strategy',
				},
				{
					label: 'transaction/log',
				},
				{
					label: 'source slash id',
				},
				{
					label: 'block/timestamp',
				},
			],
			[
				{
					label: 'slashed shares',
				},
				{
					label: 'slashed amount',
				},
				'reason',
				{
					label: 'network',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operator',
				items: [
					{
						label: 'EigenLayer operator',
					},
				],
			},
			{
				label: 'AVS',
				items: [
					{
						label: 'EigenLayer AVS',
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
				label: 'Transaction',
				items: [
					{
						label: 'EVM transaction when transaction hash resolves',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'slashing/allocation-manager event logs',
					},
					{
						label: 'explorer/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerSlashingEvent>
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
	entityType={EntityType.EigenLayerSlashingEvent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
