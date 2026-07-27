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
	}: EntityListViewProps<EntityType.TrustedIssuer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TrustedIssuer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: trustedIssuer })}
		<EntityView
			entityType={EntityType.TrustedIssuer}
			entitySelector={trustedIssuer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				trusted issuer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
