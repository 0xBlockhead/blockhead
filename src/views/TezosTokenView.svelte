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
				label: 'network',
			},
			{
				label: 'contract address',
			},
			{
				label: 'token id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'contract address',
					},
					{
						label: 'token id',
					},
					'standard',
					{
						label: 'contract ref',
					},
					{
						label: 'latest name/symbol/decimals',
					},
					{
						label: 'latest media URI availability',
					},
					{
						label: 'latest supply',
					},
					{
						label: 'holder count',
					},
					{
						label: 'transfer count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Contract',
					items: [
						{
							label: 'parent Tezos contract',
						},
					],
				},
				{
					label: 'Metadata/history',
					items: [
						{
							label: 'level/source token metadata observations',
						},
					],
				},
				{
					label: 'Balances',
					items: [
						{
							label: 'token balance observations grouped by holder',
						},
					],
				},
				{
					label: 'Transfers',
					items: [
						{
							label: 'token transfer rows',
						},
					],
				},
				{
					label: 'Ledger storage',
					items: [
						{
							label: 'big-map rows for ledger/token_metadata big maps when resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosToken>
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
	entityType={EntityType.TezosToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
