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
		'taskId',
		'$service',
		{
			label: 'context',
		},
	],
	content: {
		dl: [
			[
				'taskId',
				'$service',
				'providerTaskId',
				'contextId',
			],
			[
				{
					label: 'created/updated/cancelled at',
				},
				'listed',
				{
					label: 'latest state',
				},
				{
					label: 'event/message/artifact refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Events',
				items: [
					{
						label: 'A2aTaskEvent list',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'A2aMessage list',
					},
				],
			},
			{
				label: 'Artifacts',
				items: [
					{
						label: 'A2aArtifact list',
					},
				],
			},
			{
				label: 'Status',
				items: [
					{
						label: 'A2aTask_Timestamp list',
					},
				],
			},
			{
				label: 'Service',
				items: [
					{
						label: 'A2aAgentService',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'events',
			label: 'events',
			field: '$$events',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'messages',
			label: 'messages',
			field: '$$messages',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'artifacts',
			label: 'artifacts',
			field: '$$artifacts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'push-notification-configs',
			label: 'push notification configs',
			field: '$$pushNotificationConfigs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aTask>
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
	entityType={EntityType.A2aTask}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
