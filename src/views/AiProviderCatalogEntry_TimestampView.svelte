<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AiProviderCatalogEntry_Timestamp>, 'prefetched'> = $props()

	const aiProviderCatalogEntryTimestamp = $derived(selection({
		sources: selection.sources ?? [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
	})({
		fields: {
			availabilityStatus: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiProviderCatalogEntryView from '$/views/AiProviderCatalogEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.AiProviderCatalogEntry_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'AI provider catalog entry timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<AiProviderCatalogEntryView
			selection={select(EntityType.AiProviderCatalogEntry, selection.entitySelector.$entry)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiProviderCatalogEntryTimestamp}>
			{#snippet children(entity)}
				{@const availabilityStatus = entity.availabilityStatus}
				{#if availabilityStatus != null}
					<span data-text="muted">
						{availabilityStatus}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>entry</dt>
				<dd>
					<AiProviderCatalogEntryView
						selection={select(EntityType.AiProviderCatalogEntry, selection.entitySelector.$entry)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={aiProviderCatalogEntryTimestamp}
			>
				{#snippet children(entity)}
					{@const availabilityStatus = entity.availabilityStatus}
					{#if availabilityStatus != null}
						<div>
							<dt>availability status</dt>
							<dd>
								{availabilityStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
