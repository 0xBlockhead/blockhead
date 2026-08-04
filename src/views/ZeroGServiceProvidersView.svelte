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
	}: EntityListViewProps<EntityType.ZeroGServiceProvider> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGServiceProvider}
	bind:open
	resource={
		selection({
			fields: {
				providerId: true,
				serviceKind: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGServiceProvider })}
		{@const zeroGServiceProviderSelector = zeroGServiceProvider[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGServiceProvider}
			entitySelector={zeroGServiceProviderSelector}
		>
			{#snippet Title()}
				{zeroGServiceProviderSelector.providerId || 'zero g service provider'}
			{/snippet}

			{#snippet Value()}
				{zeroGServiceProvider.serviceKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGServiceProvider.$network.name || (zeroGServiceProvider.$network.caip2 == null ? '' : `${zeroGServiceProvider.$network.caip2.namespace}:${zeroGServiceProvider.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
