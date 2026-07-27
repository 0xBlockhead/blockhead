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
	}: EntityListViewProps<EntityType.CashuKeyset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CashuKeyset}
	bind:open
	resource={
		selection({
			fields: {
				keysetId: true,
				unit: true,
				$mint: true,
			},
		})
	}
>
	{#snippet Item({ item: cashuKeyset })}
		{@const cashuKeysetSelector = cashuKeyset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CashuKeyset}
			entitySelector={cashuKeysetSelector}
		>
			{#snippet Title()}
				{cashuKeysetSelector.keysetId || 'Cashu keyset'}
			{/snippet}

			{#snippet Value()}
				{(cashuKeyset.unit ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cashuKeysetSelector.$mint.mintUrl || 'Cashu mint'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
