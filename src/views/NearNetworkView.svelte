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
		'slug',
		'name',
		'environment',
	],
	content: {
		dl: [
			[
				'slug',
				'name',
				'environment',
				{
					label: 'head block',
				},
				{
					label: 'native asset count',
				},
			],
			[
				{
					label: 'epoch',
				},
				{
					label: 'protocol version',
				},
				{
					label: 'validator counts',
				},
				{
					label: 'gas price',
				},
				{
					label: 'network snapshots',
				},
			],
			[
				'$$validators',
				{
					label: 'endpoints',
				},
				{
					label: 'native assets',
				},
				{
					label: 'faucets',
				},
				{
					label: 'block explorers',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blocks',
				items: [
					{
						label: 'NearBlock list',
					},
				],
			},
			{
				label: 'Validators',
				items: [
					{
						label: 'NearValidator list',
					},
				],
			},
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'NearNetwork_Timestamp list',
					},
				],
			},
			{
				label: 'Endpoints/resources',
				items: [
					'rpcEndpoints',
					{
						label: 'native assets',
					},
					{
						label: 'faucets',
					},
					{
						label: 'block explorers',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'validators',
			label: 'validators',
			field: '$$validators',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearNetwork>
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
	entityType={EntityType.NearNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
