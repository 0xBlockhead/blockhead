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
	}: EntityListViewProps<EntityType.TonAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				balanceNano: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: tonAccountTimestamp })}
		<EntityView
			entityType={EntityType.TonAccount_Timestamp}
			entitySelector={tonAccountTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{String(tonAccountTimestamp.balanceNano ?? '') || 'TON account timestamp'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tonAccountTimestamp.status ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
