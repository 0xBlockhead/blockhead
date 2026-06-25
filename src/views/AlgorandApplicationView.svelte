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
		'applicationId',
		'creator',
		{
			label: 'latest program hashes',
		},
	],
	content: {
		dl: [
			[
				'applicationId',
				'creator',
				'$network',
			],
			[
				{
					label: 'latest approval/clear program hashes',
				},
				{
					label: 'latest box count',
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
				label: 'Latest params',
				items: [
					{
						label: 'latest round/source application observation',
					},
				],
			},
			{
				label: 'Param/global-state history',
				items: [
					{
						label: 'round/source application observations',
					},
				],
			},
			{
				label: 'Boxes',
				items: [
					{
						label: 'application box identities and value observations',
					},
				],
			},
			{
				label: 'Local state accounts',
				items: [
					{
						label: 'account-scoped local-state rows',
					},
				],
			},
			{
				label: 'TEAL programs',
				items: [
					{
						label: 'program rows for latest approval/clear hashes',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions creating/updating/calling this application when indexed',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'boxes',
			label: 'boxes',
			field: '$$boxes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'local-state-rounds',
			label: 'local state rounds',
			field: '$$localStateRounds',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandApplication>
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
	entityType={EntityType.AlgorandApplication}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
