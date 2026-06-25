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
		'$network',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$network',
				'timestampMs',
				'source',
				{
					label: 'finalized block number/hash',
				},
				'finalizedExtrinsicCount',
			],
			[
				{
					label: 'runtime spec name/version',
				},
				'transactionVersion',
				'stateVersion',
				'peerCount',
				{
					label: 'sync state',
				},
			],
			[
				{
					label: 'era/session indexes',
				},
				'activeValidatorCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Finalized block',
				items: [
					{
						label: 'finalized Polkadot block when resolved',
					},
				],
			},
			{
				label: 'Runtime',
				items: [
					{
						label: 'version fields',
					},
				],
			},
			{
				label: 'Health',
				items: [
					{
						label: 'peers',
					},
					{
						label: 'sync state',
					},
				],
			},
			{
				label: 'Staking/session',
				items: [
					{
						label: 'era',
					},
					{
						label: 'session',
					},
					{
						label: 'active validator fields',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'JSON-RPC finalized head/header/block/runtimeVersion/system_health responses',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotNetwork_Timestamp>
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
	entityType={EntityType.PolkadotNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
