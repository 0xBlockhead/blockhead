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
		'query',
		'createdAt',
		'resultLimit',
	],
	content: {
		dl: [
			[
				'query',
				'createdAt',
				'resultLimit',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Matching names',
				items: [
					{
						label: 'EnsName list from $$matchingNames',
					},
				],
			},
			{
				label: 'Search state',
				items: [
					'query',
					'createdAt',
					'resultLimit',
				],
			},
		],
	},
	lists: [
		{
			id: 'matching-names',
			label: 'matching names',
			field: '$$matchingNames',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadEnsNameSearch>
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
	entityType={EntityType.BlockheadEnsNameSearch}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
