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
		'repoDid',
		'rev',
		'commitCid',
	],
	content: {
		dl: [
			[
				'repoDid',
				'rev',
				'commitCid',
				'previousRev',
				'dataCid',
			],
			[
				'sequence',
				'source',
				{
					label: 'host',
				},
				'time',
				'operationCount',
			],
			[
				'blobCount',
				'carByteLength',
				{
					label: 'too-big/rebase flags',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operations',
				items: [
					{
						label: 'path/action/CID summary grouped into created',
					},
					{
						label: 'updated',
					},
					{
						label: 'deleted records',
					},
				],
			},
			{
				label: 'Posts',
				items: [
					{
						label: 'AtprotoPost list for app.bsky.feed.post ops',
					},
				],
			},
			{
				label: 'Repository data',
				items: [
					{
						label: 'commit/data/previous-data CIDs',
					},
					{
						label: 'CAR metadata',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'PDS/relay host',
					},
					{
						label: 'repo sync payload fields',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'posts',
			label: 'posts',
			field: '$$posts',
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
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoRepoCommit>
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
	entityType={EntityType.AtprotoRepoCommit}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
