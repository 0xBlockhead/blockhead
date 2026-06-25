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
		'outcomeKind',
		'outcomeKind',
		{
			label: 'latest status',
		},
	],
	content: {
		dl: [
			[
				'$sessionAction',
				'outcomeId',
				'outcomeKind',
				'$walletRequest',
				'$intentOrder',
			],
			[
				'$simulation',
				{
					label: 'transaction hash/id',
				},
				'bridgeTransferId',
				'createdAt',
				'outcomePayloadHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Status history',
				items: [
					{
						label: 'BlockheadActionOutcome_Timestamp list',
					},
				],
			},
			{
				label: 'Session action',
				items: [
					{
						label: 'BlockheadSessionActionView',
					},
				],
			},
			{
				label: 'Wallet request',
				items: [
					{
						label: 'BlockheadWalletRequestView when linked',
					},
				],
			},
			{
				label: 'Intent order',
				items: [
					{
						label: 'BlockheadIntentOrderView when linked',
					},
				],
			},
			{
				label: 'Simulation',
				items: [
					{
						label: 'BlockheadSessionSimulationView when linked',
					},
				],
			},
			{
				label: 'Public evidence',
				items: [
					{
						label: 'transaction/receipt/bridge transfer rows when resolved outside this local artifact',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadActionOutcome>
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
	entityType={EntityType.BlockheadActionOutcome}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
