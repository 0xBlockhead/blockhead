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
	}: EntityListViewProps<EntityType.FedimintGateway_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FedimintGateway_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				online: true,
				version: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: fedimintGatewayTimestamp })}
		{@const fedimintGatewayTimestampSelector = fedimintGatewayTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FedimintGateway_Timestamp}
			entitySelector={fedimintGatewayTimestampSelector}
		>
			{#snippet Title()}
				{fedimintGatewayTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(fedimintGatewayTimestamp.online ?? ''), (fedimintGatewayTimestamp.version ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{fedimintGatewayTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
