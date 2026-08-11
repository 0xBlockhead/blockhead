<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSource> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSource}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Constants_Internal,
					Source.Local_Internal,
				],
				fields: {
					label: true,
					provider: true,
					source: true,
					endpointUrl: true,
					transportKind: true,
					authKind: true,
					corsMode: true,
					proxyMode: true,
					environmentScope: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadSource })}
		{@const blockheadSourceSelector = blockheadSource[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSource}
			entitySelector={blockheadSourceSelector}
			href={
				resolve(
					'/~/manage/source/[sourceId=stringSegment]',
					{
						sourceId: blockheadSourceSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{[(blockheadSource.label ?? ''), (blockheadSource.provider ?? '')].filter(Boolean).join(' ') || blockheadSourceSelector.id || 'source'}
			{/snippet}

			{#snippet Value()}
				{[(blockheadSource.source ?? ''), (blockheadSource.endpointUrl ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(blockheadSource.transportKind ?? ''), (blockheadSource.authKind ?? ''), (blockheadSource.corsMode ?? ''), (blockheadSource.proxyMode ?? ''), (blockheadSource.environmentScope ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
