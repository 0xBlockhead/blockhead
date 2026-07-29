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
	}: EntityListViewProps<EntityType.CelestiaNamespace_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNamespace_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				height: true,
				blobCount: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: celestiaNamespaceTimestamp })}
		{@const celestiaNamespaceTimestampSelector = celestiaNamespaceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaNamespace_Timestamp}
			entitySelector={celestiaNamespaceTimestampSelector}
		>
			{#snippet Title()}
				{celestiaNamespaceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(celestiaNamespaceTimestamp.height ?? ''), String(celestiaNamespaceTimestamp.blobCount ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{celestiaNamespaceTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
