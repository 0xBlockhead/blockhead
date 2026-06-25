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
		'displayName',
		'peerId',
		'$room',
	],
	content: {
		dl: [
			[
				'displayName',
				'peerId',
				'$room',
				{
					label: 'connected flag',
				},
				{
					label: 'joined/last seen/connected/disconnected timestamps',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Room',
				items: [
					{
						label: 'parent local room',
					},
				],
			},
			{
				label: 'Shared addresses',
				items: [
					{
						label: 'shared-address rows scoped to peer',
					},
				],
			},
			{
				label: 'Transfer requests',
				items: [
					{
						label: 'peer-scoped transfer request rows when linked',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRoomPeer>
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
	entityType={EntityType.BlockheadRoomPeer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
