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
		'$transaction',
		'outputIndex',
		'valueSats',
	],
	content: {
		dl: [
			[
				'$transaction',
				'outputIndex',
				'valueSats',
				'$address',
				'scriptPubKeyType',
				{
					label: 'spent state',
				},
				{
					label: 'chain-specific asset/token indicators',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Script',
				items: [
					{
						label: 'script pubkey asm/hex/type',
					},
				],
			},
			{
				label: 'Address',
				items: [
					{
						label: 'address projection when resolved',
					},
				],
			},
			{
				label: 'Elements',
				items: [
					{
						label: 'Elements asset identity',
					},
					{
						label: 'asset/value/nonce commitments',
					},
					'surjectionProof',
					'rangeProof',
					{
						label: 'confidential flag',
					},
				],
			},
			{
				label: 'CashTokens',
				items: [
					{
						label: 'fungible amount',
					},
					{
						label: 'NFT facets',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					'$transaction',
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoOutput>
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
	entityType={EntityType.UtxoOutput}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
