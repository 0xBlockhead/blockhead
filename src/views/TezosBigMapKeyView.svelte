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
		'$bigMap',
		'keyHash',
		{
			label: 'latest key summary',
		},
	],
	content: {
		dl: [
			[
				'$bigMap',
				'keyHash',
				{
					label: 'latest key summary',
				},
				{
					label: 'latest value summary',
				},
				{
					label: 'first/last level',
				},
				'$$updates',
				{
					label: 'active state',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Big map',
				items: [
					{
						label: 'parent Tezos big map',
					},
				],
			},
			{
				label: 'Current/history',
				items: [
					{
						label: 'level/source key-value observations',
					},
				],
			},
			{
				label: 'Updates',
				items: [
					{
						label: 'big-map diffs for this key',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'key lookup',
					},
					{
						label: 'history payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'updates',
			label: 'updates',
			field: '$$updates',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBigMapKey>
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
	entityType={EntityType.TezosBigMapKey}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
