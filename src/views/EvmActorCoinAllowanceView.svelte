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
				label: 'owner account',
			},
			{
				label: 'spender address',
			},
			{
				label: 'spender contract when code is detected',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'owner account',
					},
					{
						label: 'spender address',
					},
					{
						label: 'spender contract when code is detected',
					},
					{
						label: 'token contract/asset',
					},
					{
						label: 'latest block-bounded allowance amount',
					},
					{
						label: 'latest block',
					},
					{
						label: 'latest source',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Allowance reads',
					items: [
						{
							label: 'block-bounded allowance observations',
						},
					],
				},
				{
					label: 'Owner balance',
					items: [
						{
							label: 'owner/token balance row',
						},
					],
				},
				{
					label: 'Token contract',
					items: [
						{
							label: 'ERC-20 token contract',
						},
					],
				},
				{
					label: 'Spender',
					items: [
						{
							label: 'spender EVM account/contract',
						},
					],
				},
				{
					label: 'Approval events',
					items: [
						{
							label: 'EVM logs scoped to ERC-20 Approval topic when an indexer/log resolver exists',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmActorCoinAllowance>
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
	entityType={EntityType.EvmActorCoinAllowance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
