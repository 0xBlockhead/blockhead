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
			label: 'task',
		},
		{
			label: 'observation time',
		},
		'state',
	],
	content: {
		dl: [
			[
				{
					label: 'task',
				},
				{
					label: 'timestamp',
				},
				'source',
				'state',
			],
			[
				{
					label: 'status message',
				},
				'error',
				{
					label: 'raw status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Task',
				items: [
					{
						label: 'A2aTask',
					},
				],
			},
			{
				label: 'Status',
				items: [
					{
						label: 'state/message/error/raw payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aTask_Timestamp>
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
	entityType={EntityType.A2aTask_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
