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
		'$repository',
		'refName',
		'refKind',
	],
	content: {
		dl: [
			[
				'$repository',
				'refName',
				'refKind',
				'targetObjectId',
				'symbolicTarget',
				'$$observations',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped ref target observations',
					},
				],
			},
			{
				label: 'Target',
				items: [
					{
						label: 'target Git object/commit/tag when resolved',
					},
				],
			},
			{
				label: 'Repository',
				items: [
					{
						label: 'parent Git repository',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'observations',
			label: 'observations',
			field: '$$observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitRef>
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
	entityType={EntityType.GitRef}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
