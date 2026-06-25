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
		'$owner',
		'$spender',
		'allowanceKind',
	],
	content: {
		dl: [
			[
				'$owner',
				'$spender',
				'allowanceKind',
				'tokenId',
				{
					label: 'NFT serial',
				},
			],
			[
				{
					label: 'token/NFT refs',
				},
				{
					label: 'latest amount or approved-for-all state',
				},
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest allowance-state observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped allowance-state observations',
					},
				],
			},
			{
				label: 'Owner',
				items: [
					{
						label: 'owner Hedera account',
					},
				],
			},
			{
				label: 'Spender',
				items: [
					{
						label: 'spender Hedera account',
					},
				],
			},
			{
				label: 'Token/NFT',
				items: [
					{
						label: 'linked Hedera token or NFT serial',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'allowance approve/delete transactions when indexed',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.HederaAllowance>
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
	entityType={EntityType.HederaAllowance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
