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
		'latestLedger',
		'protocolVersion',
		'baseFee',
	],
	content: {
		dl: [
			[
				'latestLedger',
				'protocolVersion',
				'baseFee',
				'baseReserve',
				'source',
				'timestampMs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'StellarNetwork',
					},
				],
			},
			{
				label: 'Ledger head',
				items: [
					'latestLedger',
					'protocolVersion',
				],
			},
			{
				label: 'Fees/reserve',
				items: [
					'baseFee',
					'baseReserve',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon root/ledger',
					},
					{
						label: 'Stellar RPC',
					},
					{
						label: 'explorer/indexer stats',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarNetwork_Timestamp>
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
	entityType={EntityType.StellarNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
