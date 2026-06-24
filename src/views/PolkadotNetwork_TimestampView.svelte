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
			label: 'timestamp',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'timestamp',
				},
				'source',
				{
					label: 'finalized block number/hash',
				},
				{
					label: 'finalized extrinsic count',
				},
				{
					label: 'runtime spec name/version',
				},
				{
					label: 'transaction version',
				},
				{
					label: 'state version',
				},
				{
					label: 'peer count',
				},
				{
					label: 'sync state',
				},
				{
					label: 'era/session indexes',
				},
				{
					label: 'active validator count',
				},
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
