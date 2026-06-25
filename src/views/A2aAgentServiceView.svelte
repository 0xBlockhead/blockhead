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
		'$card',
		'protocolBinding',
		{
			label: 'endpoint',
		},
	],
	content: {
		dl: [
			[
				'$card',
				'protocolBinding',
				'endpointUrl',
			],
			[
				'transportKind',
				'authKind',
				{
					label: 'task refs',
				},
				{
					label: 'latest health',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Tasks',
				items: [
					{
						label: 'A2aTask list',
					},
				],
			},
			{
				label: 'Health',
				items: [
					{
						label: 'A2aAgentService_Timestamp list',
					},
				],
			},
			{
				label: 'Card',
				items: [
					{
						label: 'A2aAgentCard',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'tasks',
			label: 'tasks',
			field: '$$tasks',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentService>
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
	entityType={EntityType.A2aAgentService}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
