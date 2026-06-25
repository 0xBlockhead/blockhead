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
		'$network',
		'assetKind',
		'assetId',
	],
	content: {
		dl: [
			[
				'$network',
				'assetKind',
				'assetId',
				{
					label: 'latest metadata/supply/role summary',
				},
				{
					label: 'balance snapshot count',
				},
				{
					label: 'latest observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset observations',
				items: [
					{
						label: 'timestamped asset metadata/supply/role observations',
					},
				],
			},
			{
				label: 'Account balances',
				items: [
					{
						label: 'asset balance observations grouped by account',
					},
				],
			},
			{
				label: 'Runtime pallet',
				items: [
					{
						label: 'runtime pallet for Assets/ForeignAssets/Tokens when resolved',
					},
				],
			},
			{
				label: 'Holders/transfers',
				items: [
					{
						label: 'indexed account balances',
					},
					{
						label: 'extrinsics when source-scoped',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'balance-timestamps',
			label: 'balance timestamps',
			field: '$$balanceTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAsset>
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
	entityType={EntityType.PolkadotAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
