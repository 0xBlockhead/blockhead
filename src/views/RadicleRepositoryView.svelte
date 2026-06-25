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
		'rid',
		'$gitRepository',
		'name',
	],
	content: {
		dl: [
			[
				'rid',
				'$gitRepository',
				'name',
				'description',
				'visibility',
			],
			[
				'defaultBranch',
				'$$delegates',
				{
					label: 'latest signed-ref status',
				},
				'$$issues',
				{
					label: 'patch count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Identity',
				items: [
					{
						label: 'identity documents',
					},
					{
						label: 'identity revisions',
					},
					'$$delegates',
				],
			},
			{
				label: 'Signed refs',
				items: [
					{
						label: 'signed refs by node/ref',
					},
				],
			},
			{
				label: 'Collaboration',
				items: [
					{
						label: 'issues/patches/comments/events',
					},
				],
			},
			{
				label: 'Replication',
				items: [
					{
						label: 'BlockheadRadicleSeedObservation_Timestamp rows when a connected node observes availability',
					},
				],
			},
			{
				label: 'Git storage',
				items: [
					'$gitRepository',
				],
			},
		],
	},
	lists: [
		{
			id: 'delegates',
			label: 'delegates',
			field: '$$delegates',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'signed-refs',
			label: 'signed refs',
			field: '$$signedRefs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'issues',
			label: 'issues',
			field: '$$issues',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'patches',
			label: 'patches',
			field: '$$patches',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'seed-observations',
			label: 'seed observations',
			field: '$$seedObservations',
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleRepository>
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
	entityType={EntityType.RadicleRepository}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
