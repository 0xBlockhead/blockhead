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
		'address',
		'$network',
		{
			label: 'latest SUI balance',
		},
	],
	content: {
		dl: [
			[
				'address',
				'$network',
				{
					label: 'latest SUI balance',
				},
				{
					label: 'owned object count',
				},
				'$$transactions',
				{
					label: 'balance snapshot count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Balances',
				items: [
					{
						label: 'coin balance observations grouped by coin type',
					},
				],
			},
			{
				label: 'Owned objects',
				items: [
					{
						label: 'Sui objects owned by this account',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Sui transactions involving this account',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Sui network',
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
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiAccount>
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
	entityType={EntityType.SuiAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
