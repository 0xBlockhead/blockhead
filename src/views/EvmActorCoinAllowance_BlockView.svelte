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
			label: 'allowance identity',
		},
		{
			label: 'block number',
		},
		{
			label: 'block tag',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'allowance identity',
				},
				{
					label: 'block number',
				},
				{
					label: 'block tag',
				},
				'source',
				{
					label: 'raw allowance amount',
				},
				{
					label: 'checked timestamp',
				},
				{
					label: 'owner',
				},
				{
					label: 'spender',
				},
				{
					label: 'token contract',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Allowance',
				items: [
					{
						label: 'parent allowance identity',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'EVM block when resolved',
					},
				],
			},
			{
				label: 'Contract call',
				items: [
					{
						label: 'allowance(owner,spender) calldata/return value',
					},
					{
						label: 'RPC block tag',
					},
				],
			},
			{
				label: 'Actor balance',
				items: [
					{
						label: 'same-block actor/token balance observation when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmActorCoinAllowance_Block>
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
	entityType={EntityType.EvmActorCoinAllowance_Block}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
