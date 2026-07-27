<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.A2aAgentCard_Snapshot> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentCard_Snapshot}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				version: true,
				contentHash: true,
				protocolVersion: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aAgentCardSnapshot })}
		{@const a2aAgentCardSnapshotSelector = a2aAgentCardSnapshot[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aAgentCard_Snapshot}
			entitySelector={a2aAgentCardSnapshotSelector}
		>
			{#snippet Title()}
				{(a2aAgentCardSnapshot.name ?? '') || String(a2aAgentCardSnapshotSelector.contentHash) || 'A2A agent card snapshot'}
			{/snippet}

			{#snippet Value()}
				{(a2aAgentCardSnapshot.version ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(a2aAgentCardSnapshot.protocolVersion ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
