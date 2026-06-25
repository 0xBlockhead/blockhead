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
		'$validator',
		'slot',
		'source',
	],
	content: {
		dl: [
			[
				'$validator',
				'slot',
				'source',
				'balanceGwei',
				'effectiveBalanceGwei',
			],
			[
				'status',
				'slashed',
				{
					label: 'activation/exit/withdrawable epochs',
				},
				{
					label: 'finalized/execution-optimistic flags',
				},
				'timestampMs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Validator',
				items: [
					{
						label: 'parent beacon validator',
					},
				],
			},
			{
				label: 'Network state',
				items: [
					{
						label: 'consensus network snapshot context',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: '/eth/v1/beacon/states/{state_id}/validators/{validator_id} or validator-list payload',
					},
					{
						label: 'state id',
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconValidator_Timestamp>
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
	entityType={EntityType.BeaconValidator_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
