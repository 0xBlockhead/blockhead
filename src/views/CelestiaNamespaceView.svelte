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
		'namespaceId',
		{
			label: 'version',
		},
		{
			label: 'latest blob count',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'namespaceId',
				'namespaceVersion',
				'label',
				{
					label: 'latest blob count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blob count snapshots',
				items: [
					{
						label: 'timestamped namespace activity observations',
					},
				],
			},
			{
				label: 'Blobs',
				items: [
					{
						label: 'Celestia blobs filtered by namespace',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Celestia network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'namespace-id parsing',
					},
					{
						label: 'blob.GetAll namespace queries',
					},
					{
						label: 'configured namespace labels when present',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'blobs',
			label: 'blobs',
			field: '$$blobs',
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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaNamespace>
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
	entityType={EntityType.CelestiaNamespace}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
