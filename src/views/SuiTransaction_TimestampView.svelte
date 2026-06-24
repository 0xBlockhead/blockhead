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
		{
			label: 'transaction',
		},
		{
			label: 'checkpoint sequence',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'transaction',
				},
				{
					label: 'checkpoint sequence',
				},
				'source',
				{
					label: 'observation time',
				},
				'status',
				{
					label: 'confirmed local execution',
				},
			],
			[
				{
					label: 'gas budget',
				},
				{
					label: 'gas price',
				},
				{
					label: 'gas used summary',
				},
				{
					label: 'effects digest',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent Sui transaction',
					},
				],
			},
			{
				label: 'Effects',
				items: [
					'status',
					{
						label: 'gas used',
					},
					{
						label: 'effects digest',
					},
					{
						label: 'local execution flag',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'sui_getTransactionBlock/GraphQL transaction block payload',
					},
					{
						label: 'options used',
					},
					{
						label: 'indexer freshness',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SuiTransaction_Timestamp>
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
	entityType={EntityType.SuiTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
