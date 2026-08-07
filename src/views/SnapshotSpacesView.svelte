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
	}: EntityListViewProps<EntityType.SnapshotSpace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SnapshotSpace}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				symbol: true,
				proposalsCount: true,
				spaceId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: snapshotSpace })}
		{@const snapshotSpaceSelector = snapshotSpace[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SnapshotSpace}
			entitySelector={snapshotSpaceSelector}
			href={
				resolve(
					'/snapshot/space/[spaceId=stringSegment]',
					{
						spaceId: encodeURIComponent(snapshotSpaceSelector.spaceId),
					}
				)
			}
		>
			{#snippet Title()}
				{(snapshotSpace.name ?? '') || snapshotSpaceSelector.spaceId || 'Snapshot space'}
			{/snippet}

			{#snippet Value()}
				{[(snapshotSpace.symbol ?? ''), String(snapshotSpace.proposalsCount ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{snapshotSpace.$network == null ? '' : snapshotSpace.$network.name || (snapshotSpace.$network.caip2 == null ? '' : `${snapshotSpace.$network.caip2.namespace}:${snapshotSpace.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
