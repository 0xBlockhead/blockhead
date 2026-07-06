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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTokenAssociation_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaTokenAssociation_Timestamp>>
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
	const hederaTokenAssociationTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera token association timestamp')
	const viewDomId = $derived('hedera-token-association-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaTokenAssociationView from '$/views/HederaTokenAssociationView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTokenAssociation_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaTokenAssociationTimestamp}>
			{#snippet Pending()}
				{title || 'hedera token association timestamp'}
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
				<dt>association</dt>
				<dd>
					<HederaTokenAssociationView
						selection={select(EntityType.HederaTokenAssociation, selection.entitySelector.$association)}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
							associationStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const associationStatus = prefetched.associationStatus}
					{#if associationStatus !== undefined && associationStatus !== null}
						<div>
							<dt>association status</dt>
							<dd>
								{String((associationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const associationStatus = resolvedEntity.associationStatus}
					{#if associationStatus !== undefined && associationStatus !== null}
						<div>
							<dt>association status</dt>
							<dd>
								{String((associationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							balance: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balance = prefetched.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								{String((balance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balance = resolvedEntity.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								{String((balance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							kycStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const kycStatus = prefetched.kycStatus}
					{#if kycStatus !== undefined && kycStatus !== null}
						<div>
							<dt>kyc status</dt>
							<dd>
								{String((kycStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const kycStatus = resolvedEntity.kycStatus}
					{#if kycStatus !== undefined && kycStatus !== null}
						<div>
							<dt>kyc status</dt>
							<dd>
								{String((kycStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freezeStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freezeStatus = prefetched.freezeStatus}
					{#if freezeStatus !== undefined && freezeStatus !== null}
						<div>
							<dt>freeze status</dt>
							<dd>
								{String((freezeStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freezeStatus = resolvedEntity.freezeStatus}
					{#if freezeStatus !== undefined && freezeStatus !== null}
						<div>
							<dt>freeze status</dt>
							<dd>
								{String((freezeStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
