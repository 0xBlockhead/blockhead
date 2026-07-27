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
	}: EntityListViewProps<EntityType.HederaTokenAssociation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTokenAssociation}
	bind:open
	resource={
		selection({
			fields: {
				$token: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaTokenAssociation })}
		{@const hederaTokenAssociationSelector = hederaTokenAssociation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HederaTokenAssociation}
			entitySelector={hederaTokenAssociationSelector}
		>
			{#snippet Title()}
				{hederaTokenAssociationSelector.$token.tokenId || 'hedera token'}
			{/snippet}

			{#snippet Value()}
				{hederaTokenAssociationSelector.$account.accountId || 'hedera account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
