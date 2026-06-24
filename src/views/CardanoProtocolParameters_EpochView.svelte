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
		'epoch',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'epoch',
				'source',
				{
					label: 'protocol version',
				},
				{
					label: 'min fee coefficients',
				},
				{
					label: 'max block/transaction sizes',
				},
				{
					label: 'key/pool deposits',
				},
				{
					label: 'min pool cost',
				},
				{
					label: 'coins per UTXO byte',
				},
				{
					label: 'collateral settings',
				},
				{
					label: 'Plutus execution limits',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Cost models',
				items: [
					{
						label: 'decoded costModels by language',
					},
				],
			},
			{
				label: 'Execution prices',
				items: [
					{
						label: 'executionPrices/maxTxExUnits/maxBlockExUnits',
					},
				],
			},
			{
				label: 'Deposits & rewards',
				items: [
					{
						label: 'key/pool deposits',
					},
					'nOpt',
					'rho',
					'tau',
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Cardano network',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoProtocolParameters_Epoch>
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
	entityType={EntityType.CardanoProtocolParameters_Epoch}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
