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
			label: 'source/request hash',
		},
		{
			label: 'observation time',
		},
		{
			label: 'network',
		},
	],
	content: {
		dl: [
			[
				'source',
				{
					label: 'request hash',
				},
				{
					label: 'observation time',
				},
				{
					label: 'network',
				},
				{
					label: 'token in/out',
				},
				{
					label: 'amount in',
				},
				'slippage',
				{
					label: 'from/to addresses',
				},
				{
					label: 'intent',
				},
			],
			[
				{
					label: 'provider quote id',
				},
				{
					label: 'amount out',
				},
				{
					label: 'minimum amount out',
				},
				{
					label: 'price impact',
				},
				{
					label: 'gas estimate',
				},
				{
					label: 'gas USD',
				},
				{
					label: 'allowance target',
				},
				{
					label: 'transaction target',
				},
				{
					label: 'calldata hash',
				},
				'value',
				{
					label: 'valid-until time',
				},
				{
					label: 'block number',
				},
				'status',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Steps',
				items: [
					{
						label: 'quote-scoped route steps',
					},
				],
			},
			{
				label: 'Tokens',
				items: [
					{
						label: 'input/output EVM coin instances',
					},
				],
			},
			{
				label: 'Session intent',
				items: [
					{
						label: 'BlockheadSwapIntent when linked',
					},
				],
			},
			{
				label: 'Transaction request',
				items: [
					{
						label: 'target/value/calldata hash/allowance target',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'aggregator response',
					},
					{
						label: 'request parameters',
					},
					{
						label: 'block number',
					},
					{
						label: 'error payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SwapQuote_Timestamp>
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
	entityType={EntityType.SwapQuote_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
