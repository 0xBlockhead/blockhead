<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadEnsNameSearch>, 'prefetched'> = $props()

	const blockheadEnsNameSearch = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.TheGraph_Graphql,
		],
		fields: {
			createdAt: true,
			resultLimit: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.query || 'blockhead ENS name search')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EnsNamesView from '$/views/EnsNamesView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadEnsNameSearch}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/ens/name-search/[query=stringSegment]',
				{
					query: selection.entitySelector.query,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadEnsNameSearch}>
			{#snippet children(entity)}
				{String(entity.resultLimit ?? '') || selection.entitySelector.query || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Query</dt>
				<dd>
					{selection.entitySelector.query}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadEnsNameSearch}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadEnsNameSearch}
			>
				{#snippet children(entity)}
					{@const resultLimit = entity.resultLimit}
					{#if resultLimit != null}
						<div>
							<dt>result limit</dt>
							<dd>
								{resultLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const matchingNamesResource = selection.$$matchingNames}
		<ResourceBoundary
			resource={matchingNamesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EnsNamesView
						selection={matchingNamesResource}
						countResource={matchingNamesResource.count}
						title='matching names'
						id='matching-names'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
