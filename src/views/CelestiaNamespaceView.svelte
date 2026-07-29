<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.CelestiaNamespace> = $props()

	const celestiaNamespace = $derived(selection({
		fields: {
			label: true,
			namespaceVersion: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || selection.entitySelector.namespaceId || 'celestia namespace')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CelestiaNamespace_TimestampsView from '$/views/CelestiaNamespace_TimestampsView.svelte'
	import CelestiaBlobsView from '$/views/CelestiaBlobsView.svelte'
	import CelestiaNetworkView from '$/views/CelestiaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CelestiaNamespace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={celestiaNamespace}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={celestiaNamespace}>
			{#snippet children(entity)}
				{@const namespaceVersion = entity.namespaceVersion}
				{#if namespaceVersion != null}
					<NumberValue
						value={namespaceVersion}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<CelestiaNetworkView
						selection={select(EntityType.CelestiaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>namespace ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.namespaceId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={celestiaNamespace}
			>
				{#snippet children(entity)}
					{@const namespaceVersion = entity.namespaceVersion}
					{#if namespaceVersion != null}
						<div>
							<dt>namespace version</dt>
							<dd>
								<NumberValue
									value={namespaceVersion}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={celestiaNamespace}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
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
					<CelestiaNamespace_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blobsResource = selection.$$blobs}
		<ResourceBoundary
			resource={blobsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CelestiaBlobsView
						selection={blobsResource}
						countResource={blobsResource.count}
						title='blobs'
						id='blobs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
