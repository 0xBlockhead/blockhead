<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.A2aAgentInterface>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aAgentInterface = $derived(viewSelection({
		fields: {
			transportKind: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.protocolBinding || 'A2A agent interface')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aAgentCard_SnapshotView from '$/views/A2aAgentCard_SnapshotView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aAgentInterface}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.url || selection.entitySelector.protocolBinding || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aAgentInterface}>
			{#snippet children(entity)}
				{@const transportKind = entity.transportKind}
				{#if transportKind != null}
					<span data-text="muted">
						{transportKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>card snapshot</dt>
				<dd>
					<A2aAgentCard_SnapshotView
						selection={select(EntityType.A2aAgentCard_Snapshot, selection.entitySelector.$cardSnapshot)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>protocol binding</dt>
				<dd>
					{selection.entitySelector.protocolBinding}
				</dd>
			</div>

			<div>
				<dt>URL</dt>
				<dd>
					<a
						href={selection.entitySelector.url}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.url} />
					</a>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolVersion = entity.protocolVersion}
					{#if protocolVersion != null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{protocolVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aAgentInterface}
			>
				{#snippet children(entity)}
					{@const transportKind = entity.transportKind}
					{#if transportKind != null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{transportKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							mediaType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mediaType = entity.mediaType}
					{#if mediaType != null}
						<div>
							<dt>media type</dt>
							<dd>
								{mediaType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
