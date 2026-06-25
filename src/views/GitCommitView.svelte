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
		'objectId',
		'objectFormat',
		{
			label: 'title/message first line',
		},
	],
	content: {
		dl: [
			[
				'objectId',
				'objectFormat',
				{
					label: 'title/message first line',
				},
				{
					label: 'author/committer idents',
				},
				{
					label: 'authored/committed timestamps',
				},
				{
					label: 'root tree object id',
				},
				{
					label: 'parent count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parents',
				items: [
					{
						label: 'parent commit objects',
					},
				],
			},
			{
				label: 'Tree',
				items: [
					{
						label: 'root tree object',
					},
				],
			},
			{
				label: 'Signatures',
				items: [
					{
						label: 'signatures over this commit object',
					},
				],
			},
			{
				label: 'Object',
				items: [
					{
						label: 'parent Git object',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'signatures',
			label: 'signatures',
			field: '$$signatures',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitCommit>
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
	entityType={EntityType.GitCommit}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
