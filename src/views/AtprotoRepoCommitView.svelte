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
				label: 'repo DID',
			},
			'rev',
			{
				label: 'commit CID',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'repo DID',
					},
					'rev',
					{
						label: 'commit CID',
					},
					{
						label: 'previous rev',
					},
					{
						label: 'data CID',
					},
					'sequence',
					'source',
					{
						label: 'host',
					},
					'time',
					{
						label: 'operation count',
					},
					{
						label: 'blob count',
					},
					{
						label: 'CAR byte length',
					},
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
