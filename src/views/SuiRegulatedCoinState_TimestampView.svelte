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
			selection: EntityProxyResource<typeof schema, EntityType.SuiRegulatedCoinState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiRegulatedCoinState_Timestamp>>
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
	const suiRegulatedCoinStateTimestamp = $derived(selection({}))
	const titleFallback = $derived('Sui regulated coin state timestamp')
	const viewDomId = $derived('sui-regulated-coin-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiRegulatedCoinState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiRegulatedCoinStateTimestamp}>
			{#snippet Pending()}
				{title || 'Sui regulated coin state timestamp'}
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
				<dt>coin type</dt>
				<dd>
					<SuiCoinTypeView
						selection={select(EntityType.SuiCoinType, selection.entitySelector.$coinType, {})}
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
						fields: {
							denyCapObjectId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const denyCapObjectId = pendingEntity.denyCapObjectId}
					{#if denyCapObjectId !== undefined && denyCapObjectId !== null}
						<div>
							<dt>deny cap object ID</dt>
							<dd>
								{String((denyCapObjectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const denyCapObjectId = resolvedEntity.denyCapObjectId}
					{#if denyCapObjectId !== undefined && denyCapObjectId !== null}
						<div>
							<dt>deny cap object ID</dt>
							<dd>
								{String((denyCapObjectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denyListObjectId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const denyListObjectId = pendingEntity.denyListObjectId}
					{#if denyListObjectId !== undefined && denyListObjectId !== null}
						<div>
							<dt>deny list object ID</dt>
							<dd>
								{String((denyListObjectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const denyListObjectId = resolvedEntity.denyListObjectId}
					{#if denyListObjectId !== undefined && denyListObjectId !== null}
						<div>
							<dt>deny list object ID</dt>
							<dd>
								{String((denyListObjectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							globalPause: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const globalPause = pendingEntity.globalPause}
					{#if globalPause !== undefined && globalPause !== null}
						<div>
							<dt>global pause</dt>
							<dd>
								{globalPause ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const globalPause = resolvedEntity.globalPause}
					{#if globalPause !== undefined && globalPause !== null}
						<div>
							<dt>global pause</dt>
							<dd>
								{globalPause ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denyListEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const denyListEpoch = pendingEntity.denyListEpoch}
					{#if denyListEpoch !== undefined && denyListEpoch !== null}
						<div>
							<dt>deny list epoch</dt>
							<dd>
								{String((denyListEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const denyListEpoch = resolvedEntity.denyListEpoch}
					{#if denyListEpoch !== undefined && denyListEpoch !== null}
						<div>
							<dt>deny list epoch</dt>
							<dd>
								{String((denyListEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deniedAddressCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deniedAddressCount = pendingEntity.deniedAddressCount}
					{#if deniedAddressCount !== undefined && deniedAddressCount !== null}
						<div>
							<dt>denied address count</dt>
							<dd>
								<TruncatedValue value={String((deniedAddressCount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deniedAddressCount = resolvedEntity.deniedAddressCount}
					{#if deniedAddressCount !== undefined && deniedAddressCount !== null}
						<div>
							<dt>denied address count</dt>
							<dd>
								<TruncatedValue value={String((deniedAddressCount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
