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
		'timestampMs',
		'source',
		{
			label: 'latest block height/hash/time',
		},
	],
	content: {
		dl: [
			[
				'timestampMs',
				'source',
				{
					label: 'latest block height/hash/time/transaction count',
				},
			],
			[
				{
					label: 'witness counts',
				},
				{
					label: 'node/solidity heights',
				},
				{
					label: 'peer count',
				},
				'maintenanceIntervalMs',
				{
					label: 'transaction fee',
				},
				{
					label: 'create-account fee',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'TronNetwork',
					},
				],
			},
			{
				label: 'Head',
				items: [
					{
						label: 'latest block height/hash/time/transaction count',
					},
					{
						label: 'node/solidity heights',
					},
				],
			},
			{
				label: 'Witnesses',
				items: [
					'witnessCount',
					'activeWitnessCount',
				],
			},
			{
				label: 'Fees/maintenance',
				items: [
					'maintenanceIntervalMs',
					{
						label: 'transaction fee',
					},
					{
						label: 'create-account fee',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'TronGrid wallet/getnowblock',
					},
					{
						label: 'wallet/listwitnesses',
					},
					{
						label: 'wallet/getnodeinfo',
					},
					{
						label: 'wallet/getchainparameters',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronNetwork_Timestamp>
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
	entityType={EntityType.TronNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
