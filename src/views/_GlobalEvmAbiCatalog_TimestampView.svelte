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
	}: EntitySelectionViewProps<EntityType._GlobalEvmAbiCatalog_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalEvmAbiCatalogView from '$/views/_GlobalEvmAbiCatalogView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'global EVM ABI catalog timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<GlobalEvmAbiCatalogView
			selection={select(EntityType._GlobalEvmAbiCatalog, selection.entitySelector.$hub)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>hub</dt>
				<dd>
					<GlobalEvmAbiCatalogView
						selection={select(EntityType._GlobalEvmAbiCatalog, selection.entitySelector.$hub)}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceReportedSelectorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceReportedSelectorCount = entity.sourceReportedSelectorCount}
					{#if sourceReportedSelectorCount != null}
						<div>
							<dt>source reported selector count</dt>
							<dd>
								<NumberValue
									value={sourceReportedSelectorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceReportedTopicCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceReportedTopicCount = entity.sourceReportedTopicCount}
					{#if sourceReportedTopicCount != null}
						<div>
							<dt>source reported topic count</dt>
							<dd>
								<NumberValue
									value={sourceReportedTopicCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceReportedErrorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceReportedErrorCount = entity.sourceReportedErrorCount}
					{#if sourceReportedErrorCount != null}
						<div>
							<dt>source reported error count</dt>
							<dd>
								<NumberValue
									value={sourceReportedErrorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							seededSelectorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededSelectorCount = entity.seededSelectorCount}
					{#if seededSelectorCount != null}
						<div>
							<dt>seeded selector count</dt>
							<dd>
								<NumberValue
									value={seededSelectorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							seededTopicCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededTopicCount = entity.seededTopicCount}
					{#if seededTopicCount != null}
						<div>
							<dt>seeded topic count</dt>
							<dd>
								<NumberValue
									value={seededTopicCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							seededErrorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededErrorCount = entity.seededErrorCount}
					{#if seededErrorCount != null}
						<div>
							<dt>seeded error count</dt>
							<dd>
								<NumberValue
									value={seededErrorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rateLimitRemaining: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rateLimitRemaining = entity.rateLimitRemaining}
					{#if rateLimitRemaining != null}
						<div>
							<dt>rate limit remaining</dt>
							<dd>
								<NumberValue
									value={rateLimitRemaining}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
