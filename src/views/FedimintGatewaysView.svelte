<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FedimintGateway> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FedimintGateway}
	bind:open
	resource={
		selection({
			fields: {
				gatewayId: true,
				apiUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: fedimintGateway })}
		{@const fedimintGatewaySelector = fedimintGateway[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FedimintGateway}
			entitySelector={fedimintGatewaySelector}
			href={
				resolve(
					'/fedimint/gateway/[gatewayId=stringSegment]',
					{
						gatewayId: fedimintGatewaySelector.gatewayId,
					}
				)
			}
		>
			{#snippet Title()}
				{fedimintGatewaySelector.gatewayId || 'Fedimint gateway'}
			{/snippet}

			{#snippet Value()}
				{fedimintGateway.apiUrl ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
