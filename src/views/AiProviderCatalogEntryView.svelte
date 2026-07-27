<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AiProviderCatalogEntry> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
	}))
	const aiProviderCatalogEntry = $derived(viewSelection({
		fields: {
			entryLabel: true,
			subjectKind: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.entryLabel ?? '') || (pendingEntity.providerEntryId ?? '') || 'AI provider catalog entry')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AiProviderCatalogEntry_TimestampsView from '$/views/AiProviderCatalogEntry_TimestampsView.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<EntityView
	entityType={EntityType.AiProviderCatalogEntry}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiProviderCatalogEntry}>
			{#snippet children(entity)}
				{(entity.entryLabel ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.catalogKind ?? '') || (pendingEntity.entryLabel ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiProviderCatalogEntry}>
			{#snippet children(entity)}
				{@const subjectKind0 = entity.subjectKind}
				{#if subjectKind0 != null}
					<span data-text="muted">
						{subjectKind0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>provider</dt>
				<dd>
					<AiModelProviderView
						selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>catalog kind</dt>
				<dd>
					{pendingEntity.catalogKind}
				</dd>
			</div>

			<div>
				<dt>provider entry ID</dt>
				<dd>
					{pendingEntity.providerEntryId}
				</dd>
			</div>

			<ResourceBoundary
				resource={aiProviderCatalogEntry}
			>
				{#snippet children(entity)}
					{@const entryLabel = entity.entryLabel}
					{#if entryLabel != null}
						<div>
							<dt>entry label</dt>
							<dd>
								{entryLabel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiProviderCatalogEntry}
			>
				{#snippet children(entity)}
					{@const subjectKind = entity.subjectKind}
					{#if subjectKind != null}
						<div>
							<dt>subject kind</dt>
							<dd>
								{subjectKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const aiProviderCatalogEntryAiProviderCatalogEntryTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={aiProviderCatalogEntryAiProviderCatalogEntryTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiProviderCatalogEntry_TimestampsView
						selection={aiProviderCatalogEntryAiProviderCatalogEntryTimestampsViewTimestampsResource}
						countResource={aiProviderCatalogEntryAiProviderCatalogEntryTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
