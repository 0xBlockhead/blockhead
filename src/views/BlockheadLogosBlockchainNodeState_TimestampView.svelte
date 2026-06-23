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
			{
				label: 'peer count',
			},
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
					{
						label: 'listen address count',
					},
					{
						label: 'peer count',
					},
					{
						label: 'connection count',
					},
					{
						label: 'pending connection count',
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
							label: 'parent Logos Blockchain node state',
						},
					],
				},
				{
					label: 'Connectivity',
					items: [
						{
							label: 'listen addresses',
						},
						{
							label: 'peer/connection counters',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: '/network/info response',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLogosBlockchainNodeState_Timestamp>
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
	entityType={EntityType.BlockheadLogosBlockchainNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
