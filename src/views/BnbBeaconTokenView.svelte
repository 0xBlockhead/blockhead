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
		'symbol',
		'originalSymbol',
		{
			label: 'name',
		},
	],
	content: {
		dl: [
			[
				'symbol',
				'originalSymbol',
				{
					label: 'name',
				},
				{
					label: 'owner',
				},
				'tokenType',
				{
					label: 'latest supply/mintability',
				},
			],
			[
				{
					label: 'mapped contract observation',
				},
				{
					label: 'mint/burn/freeze effects',
				},
				{
					label: 'migration records',
				},
				{
					label: 'archive source evidence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped token metadata/supply observations',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'archived Beacon token transfer rows',
					},
				],
			},
			{
				label: 'Migrations',
				items: [
					{
						label: 'Beacon-to-target token migration records',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent BNB Beacon network',
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
			id: 'transfers',
			label: 'transfers',
			field: '$$transfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'migrations',
			label: 'migrations',
			field: '$$migrations',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconToken>
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
	entityType={EntityType.BnbBeaconToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
