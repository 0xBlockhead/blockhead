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
			label: 'name or id',
		},
		'createdAt',
		{
			label: 'creator',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'name or id',
				},
				'createdAt',
				{
					label: 'creator',
				},
				'$$peers',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Peers',
				items: [
					{
						label: 'BlockheadRoomPeer list',
					},
				],
			},
			{
				label: 'Shared addresses',
				items: [
					{
						label: 'BlockheadSharedAddress list when linked',
					},
				],
			},
			{
				label: 'Transfer requests',
				items: [
					{
						label: 'BlockheadTransferRequest list when linked',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'peers',
			label: 'peers',
			field: '$$peers',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRoom>
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
	entityType={EntityType.BlockheadRoom}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
