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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadIntentInvocation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadIntentInvocation>>
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
	const blockheadIntentInvocation = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$session: true,
			modality: true,
			createdAt: true,
			resolvedIntentType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.modality) ?? '')].filter(Boolean).join(' ') || 'blockhead intent invocation')
	const viewDomId = $derived('blockhead-intent-invocation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadIntentInvocation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadIntentInvocation}>
			{#snippet Pending()}
				{[String((pendingEntity.modality) ?? '')].filter(Boolean).join(' ') || title || 'blockhead intent invocation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.modality) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadIntentInvocation}>
			{#snippet Pending()}
				{[String((pendingEntity.resolvedIntentType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.modality) ?? '')].filter(Boolean).join(' ') || title || 'blockhead intent invocation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.resolvedIntentType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.modality) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadIntentInvocation}>
			{#snippet Pending()}
				{@const createdAt0 = pendingEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$session}
					>
						{#snippet children(blockheadSession)}
							{#if blockheadSession != null && blockheadSession[EntityMetaKey.Selector] != null}
								<BlockheadSessionView
									selection={select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector])}
									prefetched={blockheadSession}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>invocation ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									invocationId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const invocationId = pendingEntity.invocationId}
							{#if invocationId !== undefined && invocationId !== null}
								{String((invocationId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const invocationId = resolvedEntity.invocationId}
							{#if invocationId !== undefined && invocationId !== null}
								{String((invocationId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>modality</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									modality: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const modality = pendingEntity.modality}
							{#if modality !== undefined && modality !== null}
								{String((modality) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const modality = resolvedEntity.modality}
							{#if modality !== undefined && modality !== null}
								{String((modality) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceEntityType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceEntityType = pendingEntity.sourceEntityType}
					{#if sourceEntityType !== undefined && sourceEntityType !== null}
						<div>
							<dt>source entity type</dt>
							<dd>
								{String((sourceEntityType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceEntityType = resolvedEntity.sourceEntityType}
					{#if sourceEntityType !== undefined && sourceEntityType !== null}
						<div>
							<dt>source entity type</dt>
							<dd>
								{String((sourceEntityType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							targetEntityType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const targetEntityType = pendingEntity.targetEntityType}
					{#if targetEntityType !== undefined && targetEntityType !== null}
						<div>
							<dt>target entity type</dt>
							<dd>
								{String((targetEntityType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetEntityType = resolvedEntity.targetEntityType}
					{#if targetEntityType !== undefined && targetEntityType !== null}
						<div>
							<dt>target entity type</dt>
							<dd>
								{String((targetEntityType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourcePlacement: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourcePlacement = pendingEntity.sourcePlacement}
					{#if sourcePlacement !== undefined && sourcePlacement !== null}
						<div>
							<dt>source placement</dt>
							<dd>
								{String((sourcePlacement) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourcePlacement = resolvedEntity.sourcePlacement}
					{#if sourcePlacement !== undefined && sourcePlacement !== null}
						<div>
							<dt>source placement</dt>
							<dd>
								{String((sourcePlacement) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							targetPlacement: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const targetPlacement = pendingEntity.targetPlacement}
					{#if targetPlacement !== undefined && targetPlacement !== null}
						<div>
							<dt>target placement</dt>
							<dd>
								{String((targetPlacement) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetPlacement = resolvedEntity.targetPlacement}
					{#if targetPlacement !== undefined && targetPlacement !== null}
						<div>
							<dt>target placement</dt>
							<dd>
								{String((targetPlacement) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resolvedIntentType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resolvedIntentType = pendingEntity.resolvedIntentType}
					{#if resolvedIntentType !== undefined && resolvedIntentType !== null}
						<div>
							<dt>resolved intent type</dt>
							<dd>
								{String((resolvedIntentType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resolvedIntentType = resolvedEntity.resolvedIntentType}
					{#if resolvedIntentType !== undefined && resolvedIntentType !== null}
						<div>
							<dt>resolved intent type</dt>
							<dd>
								{String((resolvedIntentType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							intentDefinitionKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const intentDefinitionKey = pendingEntity.intentDefinitionKey}
					{#if intentDefinitionKey !== undefined && intentDefinitionKey !== null}
						<div>
							<dt>intent definition key</dt>
							<dd>
								{String((intentDefinitionKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const intentDefinitionKey = resolvedEntity.intentDefinitionKey}
					{#if intentDefinitionKey !== undefined && intentDefinitionKey !== null}
						<div>
							<dt>intent definition key</dt>
							<dd>
								{String((intentDefinitionKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							selectedOptionIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const selectedOptionIndex = pendingEntity.selectedOptionIndex}
					{#if selectedOptionIndex !== undefined && selectedOptionIndex !== null}
						<div>
							<dt>selected option index</dt>
							<dd>
								<NumberValue value={Number(selectedOptionIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const selectedOptionIndex = resolvedEntity.selectedOptionIndex}
					{#if selectedOptionIndex !== undefined && selectedOptionIndex !== null}
						<div>
							<dt>selected option index</dt>
							<dd>
								<NumberValue value={Number(selectedOptionIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							invocationPayloadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const invocationPayloadHash = pendingEntity.invocationPayloadHash}
					{#if invocationPayloadHash !== undefined && invocationPayloadHash !== null}
						<div>
							<dt>invocation payload hash</dt>
							<dd>
								<TruncatedValue value={String((invocationPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const invocationPayloadHash = resolvedEntity.invocationPayloadHash}
					{#if invocationPayloadHash !== undefined && invocationPayloadHash !== null}
						<div>
							<dt>invocation payload hash</dt>
							<dd>
								<TruncatedValue value={String((invocationPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							intentDefinitionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const intentDefinitionHash = pendingEntity.intentDefinitionHash}
					{#if intentDefinitionHash !== undefined && intentDefinitionHash !== null}
						<div>
							<dt>intent definition hash</dt>
							<dd>
								<TruncatedValue value={String((intentDefinitionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const intentDefinitionHash = resolvedEntity.intentDefinitionHash}
					{#if intentDefinitionHash !== undefined && intentDefinitionHash !== null}
						<div>
							<dt>intent definition hash</dt>
							<dd>
								<TruncatedValue value={String((intentDefinitionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							selectedOptionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const selectedOptionHash = pendingEntity.selectedOptionHash}
					{#if selectedOptionHash !== undefined && selectedOptionHash !== null}
						<div>
							<dt>selected option hash</dt>
							<dd>
								<TruncatedValue value={String((selectedOptionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const selectedOptionHash = resolvedEntity.selectedOptionHash}
					{#if selectedOptionHash !== undefined && selectedOptionHash !== null}
						<div>
							<dt>selected option hash</dt>
							<dd>
								<TruncatedValue value={String((selectedOptionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = pendingEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$createdAction}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null && blockheadSessionAction[EntityMetaKey.Selector] != null}
						<div>
							<dt>created action</dt>
							<dd>
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
