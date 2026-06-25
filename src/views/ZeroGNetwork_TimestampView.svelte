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
			label: 'head block',
		},
	],
	content: {
		dl: [
			[
				'timestampMs',
				'source',
				{
					label: 'head block',
				},
				{
					label: 'head hash/time',
				},
				'transactionCount',
			],
			[
				{
					label: 'gas used/limit/base fee',
				},
				{
					label: 'storage sync heights',
				},
				'storageTransactionCount',
				{
					label: 'latest data root/size/tx',
				},
				{
					label: 'miner count/latest miner',
				},
			],
			[
				{
					label: 'fee/reward totals',
				},
				{
					label: 'win count',
				},
				{
					label: 'expired files',
				},
				{
					label: 'pruned files',
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
						label: 'ZeroGNetwork',
					},
				],
			},
			{
				label: 'Execution head',
				items: [
					{
						label: 'head block',
					},
					{
						label: 'hash/time',
					},
					'transactionCount',
					{
						label: 'gas used/limit/base fee',
					},
				],
			},
			{
				label: 'Storage sync',
				items: [
					{
						label: 'storage sync heights',
					},
					'storageTransactionCount',
					{
						label: 'latest data root/size/tx',
					},
				],
			},
			{
				label: 'Storage miners',
				items: [
					{
						label: 'miner count',
					},
					{
						label: 'latest miner',
					},
					{
						label: 'fee/reward totals',
					},
					{
						label: 'win/expired/pruned counts',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: '0G JSON-RPC',
					},
					{
						label: '0G storage scan payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGNetwork_Timestamp>
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
	entityType={EntityType.ZeroGNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
