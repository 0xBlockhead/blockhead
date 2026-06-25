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
		'height',
		'indepHash',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$network',
				'height',
				'indepHash',
				'previousBlock',
				'timestampMs',
				'transactionCount',
			],
			[
				'rewardAddress',
				{
					label: 'reward pool',
				},
				'weaveSizeBytes',
				'blockSizeBytes',
				{
					label: 'cumulative difficulty',
				},
				'hashListMerkle',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions included in this block',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Arweave network',
					},
				],
			},
			{
				label: 'Block header',
				items: [
					'transactionRoot',
					'walletList',
					'rewardAddress',
					{
						label: 'reward pool',
					},
					'weaveSizeBytes',
					'blockSizeBytes',
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'GraphQL id lookup',
					},
					{
						label: 'GraphQL height/range page',
					},
					{
						label: 'gateway/node block endpoint',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'confirmation/deep-history availability',
					},
					{
						label: 'gateway archival behavior',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.ArweaveBlock>
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
	entityType={EntityType.ArweaveBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
