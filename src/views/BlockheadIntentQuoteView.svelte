<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
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
	}: EntitySelectionViewProps<EntityType.BlockheadIntentQuote> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadIntentQuote = $derived(viewSelection({
		fields: {
			source: true,
			quoteRequestHash: true,
			providerProtocol: true,
			requestedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.providerProtocol ?? '') || 'blockhead intent quote')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadIntentQuote_TimestampsView from '$/views/BlockheadIntentQuote_TimestampsView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadIntentQuote}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/intent/quote/[id=stringSegment]',
				{
					id: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadIntentQuote}>
			{#snippet children(entity)}
				{entity.providerProtocol || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadIntentQuote}>
			{#snippet children(entity)}
				{entity.source || entity.providerProtocol || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadIntentQuote}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.requestedAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentQuote}
					>
						{#snippet children(entity)}
							{entity.source}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>quote request hash</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentQuote}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.quoteRequestHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$sessionAction}
			>
				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null}
						{@const blockheadSessionActionInitial = untrack(() => blockheadSessionAction)}
						<div>
							<dt>session action</dt>
							<dd>
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, (blockheadSessionAction ?? blockheadSessionActionInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction ?? blockheadSessionActionInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>provider protocol</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentQuote}
					>
						{#snippet children(entity)}
							{entity.providerProtocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							intentType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const intentType = entity.intentType}
					{#if intentType != null}
						<div>
							<dt>intent type</dt>
							<dd>
								{intentType}
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
							userInteropAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const userInteropAddress = entity.userInteropAddress}
					{#if userInteropAddress != null}
						<div>
							<dt>user interop address</dt>
							<dd>
								<TruncatedValue value={userInteropAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							requestPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestPayloadHash = entity.requestPayloadHash}
					{#if requestPayloadHash != null}
						<div>
							<dt>request payload hash</dt>
							<dd>
								<TruncatedValue value={requestPayloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>requested AT</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentQuote}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.requestedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadIntentQuote_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
