<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SuiCheckpoint>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiCheckpoint>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const suiCheckpoint = $derived(selection({}))
	const titleFallback = $derived('Sui checkpoint')
	const viewDomId = $derived('sui-checkpoint-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiCheckpoint}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiCheckpoint}>
			{#snippet Pending()}
				{title || 'Sui checkpoint'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sequence: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sequence = pendingEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequence = resolvedEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							digest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const digest = pendingEntity.digest}
					{#if digest !== undefined && digest !== null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String((digest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const digest = resolvedEntity.digest}
					{#if digest !== undefined && digest !== null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String((digest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epoch = pendingEntity.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>epoch</dt>
							<dd>
								{String((epoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epoch = resolvedEntity.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>epoch</dt>
							<dd>
								{String((epoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousDigest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousDigest = pendingEntity.previousDigest}
					{#if previousDigest !== undefined && previousDigest !== null}
						<div>
							<dt>previous digest</dt>
							<dd>
								<TruncatedValue value={String((previousDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousDigest = resolvedEntity.previousDigest}
					{#if previousDigest !== undefined && previousDigest !== null}
						<div>
							<dt>previous digest</dt>
							<dd>
								<TruncatedValue value={String((previousDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
