<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Wallet capability grants',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWalletCapabilityGrant> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletCapabilityGrant}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				grantId: true,
				authorizationKind: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWalletCapabilityGrant })}
		{@const blockheadWalletCapabilityGrantSelector = blockheadWalletCapabilityGrant[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWalletCapabilityGrant}
			entitySelector={blockheadWalletCapabilityGrantSelector}
		>
			{#snippet Title()}
				{blockheadWalletCapabilityGrantSelector.grantId || 'blockhead wallet capability grant'}
			{/snippet}

			{#snippet Value()}
				{blockheadWalletCapabilityGrant.authorizationKind}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
