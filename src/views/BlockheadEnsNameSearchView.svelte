<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadEnsNameSearch> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.TheGraph_Graphql,
		],
	}))
	const blockheadEnsNameSearch = $derived(viewSelection({
		fields: {
			createdAt: true,
			resultLimit: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.query ?? '') || 'blockhead ENS name search')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EnsNamesView from '$/views/EnsNamesView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadEnsNameSearch}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.query ?? '') || 'blockhead ENS name search'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadEnsNameSearch}>
			{#snippet children(entity)}
				{String(entity.resultLimit ?? '') || pendingEntity.query || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Query</dt>
				<dd>
					{pendingEntity.query}
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
								<Timestamp timestamp={Number(createdAt)} />
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
								{String(resultLimit)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadEnsNameSearchEnsNamesViewMatchingNamesResource = selection.$$matchingNames}
		<ResourceBoundary
			resource={blockheadEnsNameSearchEnsNamesViewMatchingNamesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EnsNamesView
						selection={blockheadEnsNameSearchEnsNamesViewMatchingNamesResource}
						countResource={blockheadEnsNameSearchEnsNamesViewMatchingNamesResource.count}
						title='matching names'
						id='matching-names'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
