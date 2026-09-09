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
	}: EntityListViewProps<EntityType.AptosTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosTransaction_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				ledgerVersion: true,
				success: true,
				vmStatus: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosTransactionTimestamp })}
		{@const aptosTransactionTimestampSelector = aptosTransactionTimestamp[EntityMetaKey.Selector]}
		{@const transaction = aptosTransactionTimestampSelector.$transaction}
		<EntityView
			entityType={EntityType.AptosTransaction_Timestamp}
			entitySelector={aptosTransactionTimestampSelector}
			href={
				'version' in transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/version/[version=nonNegativeBigInt]/(aptosTransaction)/observations/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
						{
							network: (
								'caip2' in transaction.$network.$network ?
									caip2StringFromValue(transaction.$network.$network.caip2)
								:
									transaction.$network.$network.slug
							),
							version: String(transaction.version),
							ledgerVersion: String(aptosTransactionTimestampSelector.ledgerVersion),
							source: aptosTransactionTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{aptosTransactionTimestampSelector.ledgerVersion}
			{/snippet}

			{#snippet Value()}
				{[String(aptosTransactionTimestamp.success ?? ''), (aptosTransactionTimestamp.vmStatus ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosTransactionTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
