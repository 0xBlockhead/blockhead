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
	}: EntityListViewProps<EntityType.BlockheadActionReadinessCheck> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionReadinessCheck}
	bind:open
	resource={
		selection({
			fields: {
				checkKind: true,
				capabilityKey: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadActionReadinessCheck })}
		<EntityView
			entityType={EntityType.BlockheadActionReadinessCheck}
			entitySelector={blockheadActionReadinessCheck[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadActionReadinessCheck.checkKind || 'blockhead action readiness check'}
			{/snippet}

			{#snippet Value()}
				{(blockheadActionReadinessCheck.capabilityKey ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadActionReadinessCheck.createdAt)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
