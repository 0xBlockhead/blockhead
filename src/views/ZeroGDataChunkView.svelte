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
		'$dataBlob',
		'chunkIndex',
		'chunkRoot',
	],
	content: {
		dl: [
			[
				'$dataBlob',
				'chunkIndex',
				'chunkRoot',
				'sizeBytes',
				'$storageNode',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Data blob',
				items: [
					{
						label: 'parent data-root blob',
					},
				],
			},
			{
				label: 'Storage node',
				items: [
					{
						label: 'public storage node when linked',
					},
				],
			},
			{
				label: 'Local availability',
				items: [
					{
						label: 'Blockhead stored-chunk state when a connected node exposes ownership/storage state',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGDataChunk>
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
	entityType={EntityType.ZeroGDataChunk}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
