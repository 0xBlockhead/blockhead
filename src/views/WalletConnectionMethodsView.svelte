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
	}: EntityListViewProps<EntityType.WalletConnectionMethod> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.WalletConnectionMethod}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				protocol: true,
				implementationStatus: true,
			},
		})
	}
>
	{#snippet Item({ item: walletConnectionMethod })}
		<EntityView
			entityType={EntityType.WalletConnectionMethod}
			entitySelector={walletConnectionMethod[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{walletConnectionMethod.label || 'wallet connection method'}
			{/snippet}

			{#snippet Value()}
				{[(walletProtocolByProtocol[walletConnectionMethod.protocol]?.label ?? walletConnectionMethod.protocol), (walletImplementationStatusByImplementationStatus[walletConnectionMethod.implementationStatus]?.label ?? walletConnectionMethod.implementationStatus)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
