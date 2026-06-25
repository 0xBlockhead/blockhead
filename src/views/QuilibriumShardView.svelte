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
		'shardKey',
	],
	content: {
		dl: [
			[
				'shardKey',
			],
			[
				'$network',
				'shardKey',
				'shardKind',
				'$applicationAccount',
				'$$frames',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Frames',
				items: [
					{
						label: 'frames in this shard',
					},
				],
			},
			{
				label: 'Application account',
				items: [
					{
						label: 'linked Quilibrium account',
					},
				],
			},
			{
				label: 'Network',
				items: [
					'$network',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node RPC shard/frame payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'frames',
			label: 'frames',
			field: '$$frames',
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
			selection: EntityProxyResource<typeof schema, EntityType.QuilibriumShard>
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
	entityType={EntityType.QuilibriumShard}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
