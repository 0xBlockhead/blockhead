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
			label: 'application',
		},
		'round',
		{
			label: 'approval/clear program hashes',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'application',
				},
				'round',
				'source',
				{
					label: 'approval/clear program hashes',
				},
				{
					label: 'deleted state',
				},
			],
			[
				{
					label: 'box count',
				},
				{
					label: 'global/local schema',
				},
				{
					label: 'global-state summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Application',
				items: [
					{
						label: 'parent application identity',
					},
				],
			},
			{
				label: 'Global state',
				items: [
					{
						label: 'decoded',
					},
					{
						label: 'raw key-value JSON',
					},
				],
			},
			{
				label: 'Boxes at round',
				items: [
					{
						label: 'application boxes when indexed/fetched',
					},
				],
			},
			{
				label: 'TEAL programs',
				items: [
					{
						label: 'approval/clear program rows',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'algod/indexer application params payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandApplication_Timestamp>
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
	entityType={EntityType.AlgorandApplication_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
