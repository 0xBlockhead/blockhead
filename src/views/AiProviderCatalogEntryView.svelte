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

	const aiProviderCatalogEntry = $derived(selection({
		sources: selection.sources ?? [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
	})({
		fields: {
			entryLabel: true,
			subjectKind: true,
		},
	}))
	const titleFallback = $derived((prefetched.entryLabel ?? '') || selection.entitySelector.providerEntryId || 'AI provider catalog entry')


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
		{selection.entitySelector.catalogKind || (prefetched.entryLabel ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiProviderCatalogEntry}>
			{#snippet children(entity)}
				{@const subjectKind = entity.subjectKind}
				{#if subjectKind != null}
					<span data-text="muted">
						{subjectKind}
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
					{selection.entitySelector.catalogKind}
				</dd>
			</div>

			<div>
				<dt>provider entry ID</dt>
				<dd>
					{selection.entitySelector.providerEntryId}
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
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiProviderCatalogEntry_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
