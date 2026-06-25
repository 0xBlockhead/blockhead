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
		'$contract',
		'bigMapId',
		'path',
	],
	content: {
		dl: [
			[
				'$contract',
				'bigMapId',
				'path',
				'keyType',
				'valueType',
				{
					label: 'latest active/key/update counts',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Keys',
				items: [
					{
						label: 'big-map key rows',
					},
				],
			},
			{
				label: 'Updates',
				items: [
					{
						label: 'big-map diff rows',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'level/source big-map state observations',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'parent Tezos contract',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node/indexer big-map payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'keys',
			label: 'keys',
			field: '$$keys',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBigMap>
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
	entityType={EntityType.TezosBigMap}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
