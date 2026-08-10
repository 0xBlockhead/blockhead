<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.LensAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensAccount_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$account: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: lensAccountTimestamp })}
		{@const lensAccountTimestampSelector = lensAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensAccount_Timestamp}
			entitySelector={lensAccountTimestampSelector}
		>
			{#snippet Title()}
				{[(lensAccountTimestamp.$account.displayName ?? ''), (lensAccountTimestamp.$account.localName ?? ''), lensAccountTimestamp.$account.address, (lensAccountTimestamp.$account.legacyProfileId ?? '')].filter(Boolean).join(' ') || 'Lens account'}
			{/snippet}

			{#snippet Value()}
				{lensAccountTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
