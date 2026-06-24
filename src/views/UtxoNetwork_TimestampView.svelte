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
		],
		content: {
			dl: [
				[
					'timestampMs',
					'source',
					'bestBlockHeight',
					'bestBlockHash',
					'bestBlockTimeMs',
					'blockCount',
					'transactionCount',
					'blocks24h',
					'transactions24h',
					'mempoolTransactionCount',
					'mempoolSizeBytes',
					'mempoolTps',
					'averageTransactionFee24hSats',
					'medianTransactionFee24hSats',
					'suggestedTransactionFeePerByteSats',
					'blockchainSizeBytes',
				],
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
