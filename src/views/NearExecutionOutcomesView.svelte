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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearExecutionOutcome> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearExecutionOutcome}
	bind:open
	resource={
		selection({
			...{
				fields: {
					outcomeId: true,
					status: true,
					gasBurnt: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nearExecutionOutcome })}
		{@const nearExecutionOutcomeSelector = nearExecutionOutcome[EntityMetaKey.Selector]}
		{@const transaction = nearExecutionOutcomeSelector.$transaction}
		<EntityView
			entityType={EntityType.NearExecutionOutcome}
			entitySelector={nearExecutionOutcomeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/outcome/[outcomeId=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.hash,
						outcomeId: nearExecutionOutcomeSelector.outcomeId,
					}
				)
			}
		>
			{#snippet Title()}
				{nearExecutionOutcomeSelector.outcomeId || 'near execution outcome'}
			{/snippet}

			{#snippet Value()}
				{nearExecutionOutcome.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearExecutionOutcome.gasBurnt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
