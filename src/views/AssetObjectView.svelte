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
		'$assetInstance',
		'objectKey',
		'objectKind',
	],
	content: {
		dl: [
			[
				'$assetInstance',
				'objectKey',
				'objectKind',
				'$class',
				'tokenId',
				'slot',
				'metadataUri',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Class',
				items: [
					{
						label: 'parent class when class-scoped',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'token metadata document observations',
					},
				],
			},
			{
				label: 'Ownership/balance',
				items: [
					{
						label: 'account-specific balance rows when modeled separately',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'metadata',
			label: 'metadatases',
			field: '$$metadata',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetObject>
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
	entityType={EntityType.AssetObject}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
