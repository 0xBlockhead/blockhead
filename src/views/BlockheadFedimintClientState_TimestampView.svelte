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
		'$clientState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$clientState',
				'timestampMs',
				'source',
				{
					label: 'total balance',
				},
				'ecashBalanceMsat',
			],
			[
				'lightningBalanceMsat',
				'onchainBalanceSats',
				'recoveryState',
				{
					label: 'last synced time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Client',
				items: [
					{
						label: 'parent Fedimint client state',
					},
				],
			},
			{
				label: 'Federation',
				items: [
					{
						label: 'federation reached through the client',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'ecash',
					},
					{
						label: 'Lightning',
					},
					{
						label: 'on-chain wallet balances',
					},
				],
			},
			{
				label: 'Notes',
				items: [
					{
						label: 'ecash note counts',
					},
					{
						label: 'redacted OOB notes',
					},
				],
			},
			{
				label: 'Operations',
				items: [
					'operationSummaryJson',
					{
						label: 'module-local progress',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'fedimint-client-rpc balance',
					},
					{
						label: 'info',
					},
					{
						label: 'recovery',
					},
					{
						label: 'operation-list responses',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFedimintClientState_Timestamp>
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
	entityType={EntityType.BlockheadFedimintClientState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
