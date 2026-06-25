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
		'appId',
		'label',
		{
			label: 'latest submission count',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'appId',
				'label',
				'ownerSelector',
				{
					label: 'latest data submission count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Data submissions',
				items: [
					{
						label: 'data submissions filtered by app id',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped app-id observations',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Avail network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'app-id registry/indexer payload',
					},
					{
						label: 'extrinsic app-id evidence',
					},
					{
						label: 'configured app labels',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'data-submissions',
			label: 'data submissions',
			field: '$$dataSubmissions',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvailAppId>
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
	entityType={EntityType.AvailAppId}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
