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
		'$task',
		'messageId',
		'role',
	],
	content: {
		dl: [
			[
				'$task',
				'messageId',
				'role',
				'contextId',
			],
			[
				'createdAt',
				{
					label: 'part refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parts',
				items: [
					{
						label: 'A2aMessagePart list',
					},
				],
			},
			{
				label: 'Task',
				items: [
					{
						label: 'A2aTask',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'parts',
			label: 'parts',
			field: '$$parts',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aMessage>
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
	entityType={EntityType.A2aMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
