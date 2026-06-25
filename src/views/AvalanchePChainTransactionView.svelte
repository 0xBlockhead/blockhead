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
		'txId',
		'txType',
	],
	content: {
		dl: [
			[
				'$network',
				'txId',
				'txType',
				'$block',
				'subnetId',
			],
			[
				'blockchainId',
				'nodeId',
				{
					label: 'start/end time',
				},
				{
					label: 'stake',
				},
				'feeNavax',
			],
			[
				{
					label: 'latest status',
				},
				{
					label: 'import/export chain refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Status snapshots',
				items: [
					{
						label: 'timestamped transaction status observations',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing P-Chain block',
					},
				],
			},
			{
				label: 'Subnet',
				items: [
					{
						label: 'subnet when subnet id resolves',
					},
				],
			},
			{
				label: 'Blockchain',
				items: [
					{
						label: 'blockchain when blockchain id resolves',
					},
				],
			},
			{
				label: 'Validator/delegator',
				items: [
					{
						label: 'validator or delegator row when tx type maps',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'decoded unsigned tx/credentials JSON',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw P-Chain transaction payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalanchePChainTransaction>
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
	entityType={EntityType.AvalanchePChainTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
