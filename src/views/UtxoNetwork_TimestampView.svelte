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
				label: 'timestamp',
			},
			'source',
			{
				label: 'best block height/hash',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'timestamp',
					},
					'source',
					{
						label: 'best block height/hash',
					},
					{
						label: 'mempool transaction count',
					},
					{
						label: 'mempool size',
					},
					{
						label: 'suggested fee',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Head',
					items: [
						{
							label: 'best block time/hash',
						},
					],
				},
				{
					label: 'Chain totals',
					items: [
						{
							label: 'block count',
						},
						{
							label: 'transaction count',
						},
						{
							label: 'chain size',
						},
					],
				},
				{
					label: 'Recent activity',
					items: [
						{
							label: '24h block/transaction counts',
						},
					],
				},
				{
					label: 'Mempool',
					items: [
						{
							label: 'count',
						},
						{
							label: 'bytes',
						},
						{
							label: 'TPS',
						},
						{
							label: 'suggested fee',
						},
					],
				},
				{
					label: 'Fee summary',
					items: [
						{
							label: 'average/median 24h fees',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'node RPC',
						},
						{
							label: 'Blockchair dashboard stats',
						},
						{
							label: 'Esplora/mempool.space mempool and fee payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoNetwork_Timestamp>
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
	entityType={EntityType.UtxoNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
