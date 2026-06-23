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
				label: 'node',
			},
			{
				label: 'timestamp',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'node',
					},
					{
						label: 'timestamp',
					},
					'source',
					'status',
					{
						label: 'repository count',
					},
					{
						label: 'connected peer count',
					},
					{
						label: 'routing table size',
					},
					{
						label: 'advertised RID count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Node',
					items: [
						{
							label: 'parent Radicle node state',
						},
					],
				},
				{
					label: 'Advertised repositories',
					items: [
						{
							label: 'Radicle repositories when RIDs resolve',
						},
					],
				},
				{
					label: 'Raw inventory',
					items: [
						{
							label: 'connected-node payload summary',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadicleNodeInventory_Timestamp>
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
	entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
