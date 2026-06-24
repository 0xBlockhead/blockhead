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
			label: 'local node',
		},
		{
			label: 'peer node id',
		},
		{
			label: 'connection kind',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'local node',
				},
				{
					label: 'peer node id',
				},
				{
					label: 'connection kind',
				},
				{
					label: 'address count',
				},
				{
					label: 'last seen timestamp',
				},
				{
					label: 'remote alias',
				},
				{
					label: 'remote DID',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Local node',
				items: [
					{
						label: 'parent Radicle node state',
					},
				],
			},
			{
				label: 'Shared repositories',
				items: [
					{
						label: 'seed observations when inventory links both nodes',
					},
				],
			},
			{
				label: 'Addresses',
				items: [
					{
						label: 'observed peer addresses',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'connected-node peer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadiclePeer>
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
	entityType={EntityType.BlockheadRadiclePeer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
