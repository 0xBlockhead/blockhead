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
	}: EntityListViewProps<EntityType.NearAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				amountYoctoNear: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAccountTimestamp })}
		{@const nearAccountTimestampSelector = nearAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearAccount_Timestamp}
			entitySelector={nearAccountTimestampSelector}
		>
			{#snippet Title()}
				{String(nearAccountTimestampSelector.timestampMs) || 'near account timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(nearAccountTimestamp.amountYoctoNear ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(nearAccountTimestamp.blockHeight ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
