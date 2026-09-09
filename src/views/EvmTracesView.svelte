<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Traces',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmTrace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmTrace}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				index: true,
				traceAddress: true,
				type: true,
				error: true,
			},
		})
	}
>
	{#snippet Item({ item: evmTrace })}
		{@const evmTraceSelector = evmTrace[EntityMetaKey.Selector]}
		{@const transaction = evmTraceSelector.$transaction}
		<EntityView
			entityType={EntityType.EvmTrace}
			entitySelector={evmTraceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/trace/[traceAddress=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txHash,
						traceAddress: evmTraceSelector.traceAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{`Trace #${evmTrace.index}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[evmTrace.type, (evmTrace.error ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
