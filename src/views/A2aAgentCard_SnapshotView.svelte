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
		'contentHash',
		{
			label: 'name/version',
		},
	],
	content: {
		dl: [
			[
				'$card',
				{
					label: 'content hash algorithm/hash',
				},
				'fetchedAt',
				'snapshotKind',
			],
			[
				'name',
				'version',
				'protocolVersion',
				{
					label: 'provider',
				},
				'preferredTransport',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Interfaces',
				items: [
					{
						label: 'A2aAgentInterface list',
					},
				],
			},
			{
				label: 'Services',
				items: [
					{
						label: 'A2aAgentService list',
					},
				],
			},
			{
				label: 'Skills',
				items: [
					{
						label: 'A2aAgentSkill list',
					},
				],
			},
			{
				label: 'Capabilities',
				items: [
					'capabilities',
					'extensions',
				],
			},
			{
				label: 'Security',
				items: [
					'securitySchemes',
					{
						label: 'security requirements',
					},
					'signatures',
				],
			},
		],
	},
	lists: [
		{
			id: 'interfaces',
			label: 'interfaces',
			field: '$$interfaces',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'services',
			label: 'services',
			field: '$$services',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'skills',
			label: 'skills',
			field: '$$skills',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentCard_Snapshot>
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
	entityType={EntityType.A2aAgentCard_Snapshot}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
