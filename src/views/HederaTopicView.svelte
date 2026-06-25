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
		'topicId',
		{
			label: 'latest memo',
		},
		{
			label: 'admin/submit key presence',
		},
	],
	content: {
		dl: [
			[
				'topicId',
				{
					label: 'latest memo',
				},
				{
					label: 'admin/submit key presence',
				},
				{
					label: 'latest auto-renew account/period',
				},
				{
					label: 'latest fee configuration summary',
				},
				'$$messages',
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Messages',
				items: [
					{
						label: 'topic message rows',
					},
				],
			},
			{
				label: 'Latest config',
				items: [
					{
						label: 'latest topic configuration/cursor observation',
					},
				],
			},
			{
				label: 'Config history',
				items: [
					{
						label: 'timestamped topic configuration/cursor observations',
					},
				],
			},
			{
				label: 'Running hash checkpoints',
				items: [
					{
						label: 'sequence/running-hash stream evidence',
					},
				],
			},
			{
				label: 'Submitters/payers',
				items: [
					{
						label: 'latest submit key',
					},
					{
						label: 'payer account context',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTopic>
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
	entityType={EntityType.HederaTopic}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
