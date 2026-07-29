<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LensUsername> = $props()

	const lensUsername = $derived(selection({
		fields: {
			value: true,
			localName: true,
			timestamp: true,
		},
	}))
	const titleFallback = $derived([(prefetched.value ?? ''), (prefetched.localName ?? '')].filter(Boolean).join(' ') || 'Lens username')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LensUsername}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensUsername}>
			{#snippet children(entity)}
				{[(entity.value ?? ''), entity.localName].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lensUsername}>
			{#snippet children(entity)}
				{entity.localName || [(entity.value ?? ''), entity.localName].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensUsername}>
			{#snippet children(entity)}
				{@const timestamp = entity.timestamp}
				{#if timestamp != null}
					<span data-text="muted">
						<Timestamp timestamp={timestamp} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Local name</dt>
				<dd>
					<ResourceBoundary
						resource={lensUsername}
					>
						{#snippet children(entity)}
							{entity.localName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={lensUsername}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								{value}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.id}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={lensUsername}
			>
				{#snippet children(entity)}
					{@const timestamp = entity.timestamp}
					{#if timestamp != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestamp} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									namespace: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.namespace} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Owned by</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ownedBy: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.ownedBy} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							linkedTo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const linkedTo = entity.linkedTo}
					{#if linkedTo != null}
						<div>
							<dt>Linked to</dt>
							<dd>
								<TruncatedValue value={linkedTo} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
