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
		'connectionId',
		'peerId',
		'endpoint',
	],
	content: {
		dl: [
			[
				'connectionId',
				'peerId',
				'endpoint',
				{
					label: 'latest peer/connectivity observation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped connected-node observations',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'Logos Blockchain network when configured network resolves',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: '/network/info',
					},
					{
						label: 'configured local REST API',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLogosBlockchainNodeState>
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
	entityType={EntityType.BlockheadLogosBlockchainNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
