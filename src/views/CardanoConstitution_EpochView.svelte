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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoConstitution_Epoch>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoConstitution_Epoch>>
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
	const cardanoConstitutionEpoch = $derived(selection({}))
	const titleFallback = $derived('Cardano constitution epoch')
	const viewDomId = $derived('cardano-constitution-epoch-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoNetworkView from '$/views/CardanoNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoConstitution_Epoch}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoConstitutionEpoch}>
			{#snippet Pending()}
				{title || 'Cardano constitution epoch'}
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
					<CardanoNetworkView
						selection={select(EntityType.CardanoNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
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
							{@const epoch = selection.entitySelector.epoch ?? prefetched.epoch}
							{#if epoch !== undefined && epoch !== null}
								{String((epoch) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const epoch = resolvedEntity.epoch}
							{#if epoch !== undefined && epoch !== null}
								{String((epoch) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slot = prefetched.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>slot</dt>
							<dd>
								{String((slot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot = resolvedEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>slot</dt>
							<dd>
								{String((slot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							anchorUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const anchorUrl = prefetched.anchorUrl}
					{#if anchorUrl !== undefined && anchorUrl !== null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(anchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(anchorUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const anchorUrl = resolvedEntity.anchorUrl}
					{#if anchorUrl !== undefined && anchorUrl !== null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(anchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(anchorUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							anchorHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const anchorHash = prefetched.anchorHash}
					{#if anchorHash !== undefined && anchorHash !== null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={String((anchorHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const anchorHash = resolvedEntity.anchorHash}
					{#if anchorHash !== undefined && anchorHash !== null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={String((anchorHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							scriptHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const scriptHash = prefetched.scriptHash}
					{#if scriptHash !== undefined && scriptHash !== null}
						<div>
							<dt>script hash</dt>
							<dd>
								<TruncatedValue value={String((scriptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scriptHash = resolvedEntity.scriptHash}
					{#if scriptHash !== undefined && scriptHash !== null}
						<div>
							<dt>script hash</dt>
							<dd>
								<TruncatedValue value={String((scriptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousAnchorUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousAnchorUrl = prefetched.previousAnchorUrl}
					{#if previousAnchorUrl !== undefined && previousAnchorUrl !== null}
						<div>
							<dt>previous anchor URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(previousAnchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(previousAnchorUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousAnchorUrl = resolvedEntity.previousAnchorUrl}
					{#if previousAnchorUrl !== undefined && previousAnchorUrl !== null}
						<div>
							<dt>previous anchor URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(previousAnchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(previousAnchorUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousAnchorHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousAnchorHash = prefetched.previousAnchorHash}
					{#if previousAnchorHash !== undefined && previousAnchorHash !== null}
						<div>
							<dt>previous anchor hash</dt>
							<dd>
								<TruncatedValue value={String((previousAnchorHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousAnchorHash = resolvedEntity.previousAnchorHash}
					{#if previousAnchorHash !== undefined && previousAnchorHash !== null}
						<div>
							<dt>previous anchor hash</dt>
							<dd>
								<TruncatedValue value={String((previousAnchorHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
