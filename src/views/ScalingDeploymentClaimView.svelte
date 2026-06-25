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
		'$network',
		{
			label: 'source/sourceProjectId',
		},
		{
			label: 'latest architecture summary',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'source/sourceProjectId',
				},
				{
					label: 'local claim id',
				},
				'$rollup',
				{
					label: 'latest architecture/protocol/proof summary',
				},
			],
			[
				{
					label: 'latest settlement/DA/sequencing evidence',
				},
				'$$timestamps',
				{
					label: 'settlement contract refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest claim',
				items: [
					{
						label: 'latest timestamped architecture observation',
					},
				],
			},
			{
				label: 'Claim history',
				items: [
					{
						label: 'timestamped source-claim observations',
					},
				],
			},
			{
				label: 'Settlement contracts',
				items: [
					{
						label: 'contract refs only when selector evidence resolves them',
					},
				],
			},
			{
				label: 'Rollup projection',
				items: [
					{
						label: 'linked EvmRollup compatibility row when available',
					},
				],
			},
			{
				label: 'Source identity',
				items: [
					'source',
					'sourceProjectId',
					{
						label: 'local display alias',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'settlement-contracts',
			label: 'settlement contracts',
			field: '$$settlementContracts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ScalingDeploymentClaim>
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
	entityType={EntityType.ScalingDeploymentClaim}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
