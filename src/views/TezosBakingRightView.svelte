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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBakingRight>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosBakingRight>>
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
	const tezosBakingRight = $derived(selection({}))
	const titleFallback = $derived('tezos baking right')
	const viewDomId = $derived('tezos-baking-right-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosBakerView from '$/views/TezosBakerView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBakingRight}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosBakingRight}>
			{#snippet Pending()}
				{title || 'tezos baking right'}
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
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>cycle</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cycle: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const cycle = selection.entitySelector.cycle ?? prefetched.cycle}
							{#if cycle !== undefined && cycle !== null}
								{String((cycle) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const cycle = resolvedEntity.cycle}
							{#if cycle !== undefined && cycle !== null}
								{String((cycle) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>level</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									level: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const level = selection.entitySelector.level ?? prefetched.level}
							{#if level !== undefined && level !== null}
								{String((level) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const level = resolvedEntity.level}
							{#if level !== undefined && level !== null}
								{String((level) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>right kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									rightKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const rightKind = selection.entitySelector.rightKind ?? prefetched.rightKind}
							{#if rightKind !== undefined && rightKind !== null}
								{String((rightKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rightKind = resolvedEntity.rightKind}
							{#if rightKind !== undefined && rightKind !== null}
								{String((rightKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>baker address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									bakerAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const bakerAddress = selection.entitySelector.bakerAddress ?? prefetched.bakerAddress}
							{#if bakerAddress !== undefined && bakerAddress !== null}
								<TruncatedValue value={String((bakerAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const bakerAddress = resolvedEntity.bakerAddress}
							{#if bakerAddress !== undefined && bakerAddress !== null}
								<TruncatedValue value={String((bakerAddress) ?? '')} />
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
				resource={selection.$baker}
			>
				{#snippet children(tezosBaker)}
					{#if tezosBaker != null && tezosBaker[EntityMetaKey.Selector] != null}
						<div>
							<dt>baker</dt>
							<dd>
								<TezosBakerView
									selection={select(EntityType.TezosBaker, tezosBaker[EntityMetaKey.Selector])}
									prefetched={tezosBaker}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							round: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const round = prefetched.round}
					{#if round !== undefined && round !== null}
						<div>
							<dt>round</dt>
							<dd>
								{String((round) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const round = resolvedEntity.round}
					{#if round !== undefined && round !== null}
						<div>
							<dt>round</dt>
							<dd>
								{String((round) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slots: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slots = prefetched.slots}
					{#if slots !== undefined && slots !== null}
						<div>
							<dt>slots</dt>
							<dd>
								{String((slots) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slots = resolvedEntity.slots}
					{#if slots !== undefined && slots !== null}
						<div>
							<dt>slots</dt>
							<dd>
								{String((slots) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priority: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const priority = prefetched.priority}
					{#if priority !== undefined && priority !== null}
						<div>
							<dt>priority</dt>
							<dd>
								{String((priority) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priority = resolvedEntity.priority}
					{#if priority !== undefined && priority !== null}
						<div>
							<dt>priority</dt>
							<dd>
								{String((priority) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
