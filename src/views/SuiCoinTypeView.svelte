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
		'coinType',
		{
			label: 'symbol/name',
		},
		'decimals',
	],
	content: {
		dl: [
			[
				'$network',
				'coinType',
				'symbol',
				'name',
				'decimals',
				'description',
				'iconUrl',
			],
			[
				{
					label: 'defining Move struct',
				},
				'$treasuryCap',
				'$assetInstance',
				'$$balances',
				'$$objects',
				'$$regulatedStates',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Balances',
				items: [
					{
						label: 'coin balance observations grouped by account',
					},
				],
			},
			{
				label: 'Coin objects',
				items: [
					{
						label: 'Sui objects filtered by coin type',
					},
				],
			},
			{
				label: 'Regulated state',
				items: [
					{
						label: 'timestamped regulated-coin state observations',
					},
				],
			},
			{
				label: 'Move definition',
				items: [
					{
						label: 'defining Move struct',
					},
				],
			},
			{
				label: 'Asset mapping',
				items: [
					{
						label: 'asset instance and format-support observations when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'suix_getCoinMetadata',
					},
					{
						label: 'GraphQL coin metadata',
					},
					{
						label: 'treasury-cap/object ownership evidence',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'balances',
			label: 'balances',
			field: '$$balances',
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
			id: 'regulated-states',
			label: 'regulated states',
			field: '$$regulatedStates',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiCoinType>
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
	entityType={EntityType.SuiCoinType}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
