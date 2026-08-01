<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadIntentInvocation> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadIntentInvocation = $derived(viewSelection({
		fields: {
			modality: true,
			createdAt: true,
			resolvedIntentType: true,
		},
	}))
	const titleFallback = $derived((prefetched.modality ?? '') || 'blockhead intent invocation')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadIntentInvocation}>
			{#snippet children(entity)}
				{entity.modality || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadIntentInvocation}>
			{#snippet children(entity)}
				{(entity.resolvedIntentType ?? '') || entity.modality || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadIntentInvocation}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.createdAt} />
				</span>
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
							<BlockheadSessionView
								selection={select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector])}
								prefetched={blockheadSession}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>invocation ID</dt>
				<dd>
					{selection.entitySelector.invocationId}
				</dd>
			</div>

			<div>
				<dt>modality</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentInvocation}
					>
						{#snippet children(entity)}
							{entity.modality}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceEntityType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceEntityType = entity.sourceEntityType}
					{#if sourceEntityType != null}
						<div>
							<dt>source entity type</dt>
							<dd>
								{sourceEntityType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							targetEntityType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetEntityType = entity.targetEntityType}
					{#if targetEntityType != null}
						<div>
							<dt>target entity type</dt>
							<dd>
								{targetEntityType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourcePlacement: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourcePlacement = entity.sourcePlacement}
					{#if sourcePlacement != null}
						<div>
							<dt>source placement</dt>
							<dd>
								{sourcePlacement}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							targetPlacement: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetPlacement = entity.targetPlacement}
					{#if targetPlacement != null}
						<div>
							<dt>target placement</dt>
							<dd>
								{targetPlacement}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadIntentInvocation}
			>
				{#snippet children(entity)}
					{@const resolvedIntentType = entity.resolvedIntentType}
					{#if resolvedIntentType != null}
						<div>
							<dt>resolved intent type</dt>
							<dd>
								{resolvedIntentType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							intentDefinitionKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const intentDefinitionKey = entity.intentDefinitionKey}
					{#if intentDefinitionKey != null}
						<div>
							<dt>intent definition key</dt>
							<dd>
								{intentDefinitionKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							selectedOptionIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const selectedOptionIndex = entity.selectedOptionIndex}
					{#if selectedOptionIndex != null}
						<div>
							<dt>selected option index</dt>
							<dd>
								<NumberValue
									value={selectedOptionIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							invocationPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const invocationPayloadHash = entity.invocationPayloadHash}
					{#if invocationPayloadHash != null}
						<div>
							<dt>invocation payload hash</dt>
							<dd>
								<TruncatedValue value={invocationPayloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							intentDefinitionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const intentDefinitionHash = entity.intentDefinitionHash}
					{#if intentDefinitionHash != null}
						<div>
							<dt>intent definition hash</dt>
							<dd>
								<TruncatedValue value={intentDefinitionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							selectedOptionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const selectedOptionHash = entity.selectedOptionHash}
					{#if selectedOptionHash != null}
						<div>
							<dt>selected option hash</dt>
							<dd>
								<TruncatedValue value={selectedOptionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentInvocation}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$createdAction}
			>
				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null}
						<div>
							<dt>created action</dt>
							<dd>
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
