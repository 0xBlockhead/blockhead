<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.TronWitness_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.TronWitness_Timestamp>>
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
	const tronWitnessTimestamp = $derived(selection({}))
	const titleFallback = $derived('tron witness timestamp')
	const viewDomId = $derived('tron-witness-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TronWitnessView from '$/views/TronWitnessView.svelte'
</script>


<EntityView
	entityType={EntityType.TronWitness_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tronWitnessTimestamp}>
			{#snippet Pending()}
				{title || 'tron witness timestamp'}
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
				<dt>Witness</dt>
				<dd>
					<TronWitnessView
						selection={select(EntityType.TronWitness, selection.entitySelector.$witness, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
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
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
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
							{@const source = pendingEntity.source}
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
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							url: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const url = pendingEntity.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const url = resolvedEntity.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							voteCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const voteCount = pendingEntity.voteCount}
					{#if voteCount !== undefined && voteCount !== null}
						<div>
							<dt>Votes</dt>
							<dd>
								{String((voteCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const voteCount = resolvedEntity.voteCount}
					{#if voteCount !== undefined && voteCount !== null}
						<div>
							<dt>Votes</dt>
							<dd>
								{String((voteCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							totalProduced: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalProduced = pendingEntity.totalProduced}
					{#if totalProduced !== undefined && totalProduced !== null}
						<div>
							<dt>Total produced</dt>
							<dd>
								{String((totalProduced) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalProduced = resolvedEntity.totalProduced}
					{#if totalProduced !== undefined && totalProduced !== null}
						<div>
							<dt>Total produced</dt>
							<dd>
								{String((totalProduced) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							totalMissed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalMissed = pendingEntity.totalMissed}
					{#if totalMissed !== undefined && totalMissed !== null}
						<div>
							<dt>Total missed</dt>
							<dd>
								{String((totalMissed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalMissed = resolvedEntity.totalMissed}
					{#if totalMissed !== undefined && totalMissed !== null}
						<div>
							<dt>Total missed</dt>
							<dd>
								{String((totalMissed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							latestBlockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockHeight = pendingEntity.latestBlockHeight}
					{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								{String((latestBlockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockHeight = resolvedEntity.latestBlockHeight}
					{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								{String((latestBlockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							latestSlotNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestSlotNumber = pendingEntity.latestSlotNumber}
					{#if latestSlotNumber !== undefined && latestSlotNumber !== null}
						<div>
							<dt>Latest slot number</dt>
							<dd>
								{String((latestSlotNumber) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestSlotNumber = resolvedEntity.latestSlotNumber}
					{#if latestSlotNumber !== undefined && latestSlotNumber !== null}
						<div>
							<dt>Latest slot number</dt>
							<dd>
								{String((latestSlotNumber) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const active = pendingEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>Active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const active = resolvedEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>Active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
