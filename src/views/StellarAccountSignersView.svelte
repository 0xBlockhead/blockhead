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
	}: EntityListViewProps<EntityType.StellarAccountSigner> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAccountSigner}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAccountSigner })}
		<EntityView
			entityType={EntityType.StellarAccountSigner}
			entitySelector={stellarAccountSigner[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar account signer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
