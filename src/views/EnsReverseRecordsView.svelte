<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
