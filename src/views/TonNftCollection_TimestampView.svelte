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
				label: 'collection',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'collection',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'owner address',
					},
					{
						label: 'next item index',
					},
					'name',
					{
						label: 'image/metadata URI',
					},
					{
						label: 'item count',
					},
					{
						label: 'code/data hashes',
					},
					'verification',
					{
						label: 'last transaction lt',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Collection',
					items: [
						{
							label: 'parent collection identity',
						},
					],
				},
				{
					label: 'Metadata/content',
					items: [
						{
							label: 'description/content JSON',
						},
						{
							label: 'URI evidence',
						},
					],
				},
				{
					label: 'Items',
					items: [
						{
							label: 'items observed from the same source/page',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw collection/get-method/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonNftCollection_Timestamp>
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
	entityType={EntityType.TonNftCollection_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
