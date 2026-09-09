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
		title = 'State changes',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmStateChange> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmStateChange}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				kind: true,
				stateChangeKey: true,
				isMiner: true,
			},
		})
	}
>
	{#snippet Item({ item: evmStateChange })}
		{@const evmStateChangeSelector = evmStateChange[EntityMetaKey.Selector]}
		{@const transaction = evmStateChangeSelector.$transaction}
		<EntityView
			entityType={EntityType.EvmStateChange}
			entitySelector={evmStateChangeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/state-change/[stateChangeKey=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txHash,
						stateChangeKey: encodeURIComponent(evmStateChangeSelector.stateChangeKey),
					}
				)
			}
		>
			{#snippet Title()}
				{evmStateChange.kind || 'EVM state change'}
			{/snippet}

			{#snippet Value()}
				{evmStateChangeSelector.stateChangeKey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmStateChange.isMiner}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
