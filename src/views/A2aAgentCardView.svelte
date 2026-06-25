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
		'agentCardUrl',
		'$$snapshots',
	],
	content: {
		dl: [
			[
				'agentCardUrl',
				'$$snapshots',
				{
					label: 'document refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Snapshots',
				items: [
					{
						label: 'A2aAgentCard_Snapshot list',
					},
				],
			},
			{
				label: 'Documents',
				items: [
					{
						label: 'AiDocument list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'well-known URL',
					},
					{
						label: 'EIP-8004 declarations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'snapshots',
			label: 'snapshots',
			field: '$$snapshots',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'documents',
			label: 'documents',
			field: '$$documents',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentCard>
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
	entityType={EntityType.A2aAgentCard}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
