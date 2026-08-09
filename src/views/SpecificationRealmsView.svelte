<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { specificationRealmById } from '$/constants/SpecificationProposal.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SpecificationRealm> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SpecificationRealm}
	bind:open
	resource={
		selection({
			...{
				fields: {
					label: true,
					realm: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: specificationRealm })}
		{@const specificationRealmSelector = specificationRealm[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SpecificationRealm}
			entitySelector={specificationRealmSelector}
			href={
				resolve(
					'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
					{
						specificationRealmSlug: specificationRealmById[specificationRealmSelector.realm].slug,
					}
				)
			}
		>
			{#snippet Title()}
				{specificationRealm.label || specificationRealmSelector.realm || 'Specification realm'}
			{/snippet}

			{#snippet Value()}
				{specificationRealmSelector.realm}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
