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
			label: 'asset instance',
		},
		{
			label: 'token count',
		},
		{
			label: 'royalty observation count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'asset instance',
				},
				{
					label: 'token count',
				},
				{
					label: 'royalty observation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Tokens',
				items: [
					{
						label: 'collection-scoped token rows',
					},
				],
			},
			{
				label: 'Asset instance',
				items: [
					{
						label: 'parent asset instance',
					},
				],
			},
			{
				label: 'Royalty observations',
				items: [
					{
						label: 'timestamped royalty-right observations',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'collection-level token metadata documents',
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
			selection: EntityProxyResource<typeof schema, EntityType.NftCollection>
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
	entityType={EntityType.NftCollection}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
