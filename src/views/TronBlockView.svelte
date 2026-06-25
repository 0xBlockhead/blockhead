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
		'height',
		'hash',
	],
	content: {
		dl: [
			[
				'$network',
				'height',
				'hash',
				{
					label: 'parent hash/ref',
				},
				'timestampMs',
			],
			[
				'$witness',
				'txTrieRoot',
				'version',
				'transactionCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions in block',
					},
				],
			},
			{
				label: 'Parent',
				items: [
					{
						label: 'parent block',
					},
				],
			},
			{
				label: 'Witness',
				items: [
					{
						label: 'producing witness',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent TRON network',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronBlock>
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
	entityType={EntityType.TronBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
