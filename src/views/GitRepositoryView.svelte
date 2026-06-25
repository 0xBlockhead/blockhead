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
		'repositoryId',
		'canonicalRemoteUrl',
		'objectFormat',
	],
	content: {
		dl: [
			[
				'repositoryId',
				'canonicalRemoteUrl',
				'objectFormat',
				{
					label: 'default ref',
				},
				'$$remotes',
			],
			[
				'$$objects',
				'$$refs',
				{
					label: 'latest fetch status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Refs',
				items: [
					{
						label: 'GitRef list grouped by heads/tags/symbolic refs',
					},
				],
			},
			{
				label: 'Objects',
				items: [
					{
						label: 'GitObject list grouped by commit/tree/blob/tag',
					},
				],
			},
			{
				label: 'Remotes',
				items: [
					{
						label: 'GitRemote list',
					},
				],
			},
			{
				label: 'Fetches',
				items: [
					{
						label: 'GitFetchObservation history',
					},
				],
			},
			{
				label: 'Forge mirrors',
				items: [
					{
						label: 'GitForgeMirror list',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'refs',
			label: 'refs',
			field: '$$refs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'objects',
			label: 'objects',
			field: '$$objects',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'remotes',
			label: 'remotes',
			field: '$$remotes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'fetches',
			label: 'fetches',
			field: '$$fetches',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitRepository>
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
	entityType={EntityType.GitRepository}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
