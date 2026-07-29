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
	}: EntityListViewProps<EntityType.ZeroGServiceRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGServiceRequest}
	bind:open
	resource={
		selection({
			fields: {
				requestId: true,
				$serviceProvider: true,
				$requester: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGServiceRequest })}
		{@const zeroGServiceRequestSelector = zeroGServiceRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGServiceRequest}
			entitySelector={zeroGServiceRequestSelector}
		>
			{#snippet Title()}
				{zeroGServiceRequestSelector.requestId || 'zero g service request'}
			{/snippet}

			{#snippet Value()}
				{zeroGServiceRequestSelector.$serviceProvider.providerId || 'zero g service provider'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGServiceRequest.$requester == null ? '' : zeroGServiceRequest.$requester.address || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
