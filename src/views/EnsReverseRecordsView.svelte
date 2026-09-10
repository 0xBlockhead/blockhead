<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EnsReverseRecord> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsReverseRecord}
	bind:open
	resource={
		selection({
			fields: {
				$name: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: ensReverseRecord })}
		{@const ensReverseRecordSelector = ensReverseRecord[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EnsReverseRecord}
			entitySelector={ensReverseRecordSelector}
			href={
				resolve(
					'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]/(account)/ens/reverse/[ensName=stringSegment]',
					{
						namespace: ensReverseRecordSelector.$account.caip10.namespace,
						reference: ensReverseRecordSelector.$account.caip10.reference,
						accountAddress: ensReverseRecordSelector.$account.caip10.accountAddress,
						ensName: encodeURIComponent(ensReverseRecordSelector.$name.name),
					}
				)
			}
		>
			{#snippet Title()}
				{ensReverseRecordSelector.$name.name || 'ENS name'}
			{/snippet}

			{#snippet Value()}
				{`${ensReverseRecordSelector.$account.caip10.namespace}:${ensReverseRecordSelector.$account.caip10.reference}:${ensReverseRecordSelector.$account.caip10.accountAddress}` || 'account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
