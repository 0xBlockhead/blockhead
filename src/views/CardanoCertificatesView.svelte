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
	}: EntityListViewProps<EntityType.CardanoCertificate> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoCertificate}
	bind:open
	resource={
		selection({
			fields: {
				certificateKind: true,
				certificateIndex: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoCertificate })}
		{@const cardanoCertificateSelector = cardanoCertificate[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CardanoCertificate}
			entitySelector={cardanoCertificateSelector}
		>
			{#snippet Title()}
				{[cardanoCertificate.certificateKind, 'Certificate #' + String(cardanoCertificateSelector.certificateIndex)].filter(Boolean).join(' ') || 'Cardano certificate'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
