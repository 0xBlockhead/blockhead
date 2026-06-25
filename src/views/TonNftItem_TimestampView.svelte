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
		'$item',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$item',
				'timestampMs',
				'source',
				'$owner',
				'ownerAddress',
			],
			[
				'initialized',
				'name',
				{
					label: 'image/metadata URI',
				},
				'contentHash',
				{
					label: 'code/data hashes',
				},
			],
			[
				'verification',
				'lastTransactionLt',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Item',
				items: [
					{
						label: 'parent item identity',
					},
				],
			},
			{
				label: 'Owner',
				items: [
					{
						label: 'owner account identity',
					},
				],
			},
			{
				label: 'Collection',
				items: [
					{
						label: 'collection identity',
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
				label: 'Source evidence',
				items: [
					{
						label: 'raw item/get-method/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonNftItem_Timestamp>
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
	entityType={EntityType.TonNftItem_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
