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
	}: EntitySelectionViewProps<EntityType.IbcDenomTrace> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const ibcDenomTrace = $derived(selection({
		fields: {
			displayDenom: true,
			baseDenom: true,
			denomHash: true,
			sourceChannel: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.displayDenom ?? ''), (pendingEntity.baseDenom ?? ''), (pendingEntity.traceKey ?? '')].filter(Boolean).join(' ') || 'IBC denom trace')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcDenomTrace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ibcDenomTrace}>
			{#snippet children(entity)}
				{[(entity.displayDenom ?? ''), (entity.baseDenom ?? ''), pendingEntity.traceKey].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ibcDenomTrace}>
			{#snippet children(entity)}
				{[(entity.denomHash ?? ''), pendingEntity.traceKey].filter(Boolean).join(' ') || [(entity.displayDenom ?? ''), (entity.baseDenom ?? ''), pendingEntity.traceKey].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcDenomTrace}>
			{#snippet children(entity)}
				{@const sourceChannel0 = entity.sourceChannel}
				{#if sourceChannel0 != null}
					<span data-text="muted">
						{sourceChannel0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Trace key</dt>
				<dd>
					<TruncatedValue value={pendingEntity.traceKey} />
				</dd>
			</div>

			<ResourceBoundary
				resource={ibcDenomTrace}
			>
				{#snippet children(entity)}
					{@const denomHash = entity.denomHash}
					{#if denomHash != null}
						<div>
							<dt>Denom hash</dt>
							<dd>
								<TruncatedValue value={denomHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							path: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const path = entity.path}
					{#if path != null}
						<div>
							<dt>Path</dt>
							<dd>
								{path}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={ibcDenomTrace}
			>
				{#snippet children(entity)}
					{@const baseDenom = entity.baseDenom}
					{#if baseDenom != null}
						<div>
							<dt>Base denom</dt>
							<dd>
								{baseDenom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ibcDenomTrace}
			>
				{#snippet children(entity)}
					{@const displayDenom = entity.displayDenom}
					{#if displayDenom != null}
						<div>
							<dt>Display denom</dt>
							<dd>
								{displayDenom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourcePort: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourcePort = entity.sourcePort}
					{#if sourcePort != null}
						<div>
							<dt>Source port</dt>
							<dd>
								{sourcePort}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ibcDenomTrace}
			>
				{#snippet children(entity)}
					{@const sourceChannel = entity.sourceChannel}
					{#if sourceChannel != null}
						<div>
							<dt>Source channel</dt>
							<dd>
								{sourceChannel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
