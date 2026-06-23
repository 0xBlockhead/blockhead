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
				label: 'node state',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'node state',
					},
					{
						label: 'observation time',
					},
					'source',
					'alias',
					{
						label: 'listen address count',
					},
					{
						label: 'external address count',
					},
					{
						label: 'node version',
					},
					'policy',
					{
						label: 'last sync time',
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
					label: 'Addresses',
					items: [
						{
							label: 'listen/external address lists',
						},
					],
				},
				{
					label: 'Inventory',
					items: [
						{
							label: 'inventory observations at nearby times',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'radicle-node control or rad CLI payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadicleNodeState_Timestamp>
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
	entityType={EntityType.BlockheadRadicleNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
