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
			label: 'output',
		},
		{
			label: 'commitment hex',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'output',
				},
				{
					label: 'commitment hex',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Output',
				items: [
					{
						label: 'parent UTXO output',
					},
				],
			},
			{
				label: 'NFT',
				items: [
					{
						label: 'CashToken NFT carried by the same output',
					},
				],
			},
			{
				label: 'Raw commitment',
				items: [
					{
						label: 'hex display',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashCashTokenCommitment>
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
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
