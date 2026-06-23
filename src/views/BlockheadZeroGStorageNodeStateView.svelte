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
				label: 'connection id',
			},
			{
				label: 'network',
			},
			{
				label: 'node id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'connection id',
					},
					{
						label: 'network',
					},
					{
						label: 'node id',
					},
					'endpoint',
					{
						label: 'storage path',
					},
					{
						label: 'latest file/chunk/proof counts',
					},
					{
						label: 'latest sync time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'State observations',
					items: [
						{
							label: 'local timestamped file/chunk/proof count rows',
						},
					],
				},
				{
					label: 'Local chunks',
					items: [
						{
							label: 'stored chunks known to this connected node',
						},
					],
				},
				{
					label: 'Local proofs',
					items: [
						{
							label: 'proof material known to this connected node',
						},
					],
				},
				{
					label: 'Public node',
					items: [
						{
							label: 'public storage node when node id maps to a public row',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZeroGStorageNodeState>
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
	entityType={EntityType.BlockheadZeroGStorageNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
