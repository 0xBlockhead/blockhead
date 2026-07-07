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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTopicMessage>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaTopicMessage>>
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
	const hederaTopicMessage = $derived(selection({}))
	const titleFallback = $derived('hedera topic message')
	const viewDomId = $derived('hedera-topic-message-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTopicView from '$/views/HederaTopicView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTopicMessage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaTopicMessage}>
			{#snippet Pending()}
				{title || 'hedera topic message'}
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
				<dt>topic</dt>
				<dd>
					<HederaTopicView
						selection={select(EntityType.HederaTopic, selection.entitySelector.$topic, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>sequence number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sequenceNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sequenceNumber = selection.entitySelector.sequenceNumber ?? prefetched.sequenceNumber}
							{#if sequenceNumber !== undefined && sequenceNumber !== null}
								{String((sequenceNumber) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sequenceNumber = resolvedEntity.sequenceNumber}
							{#if sequenceNumber !== undefined && sequenceNumber !== null}
								{String((sequenceNumber) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusTimestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consensusTimestamp = prefetched.consensusTimestamp}
					{#if consensusTimestamp !== undefined && consensusTimestamp !== null}
						<div>
							<dt>consensus timestamp</dt>
							<dd>
								{String((consensusTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusTimestamp = resolvedEntity.consensusTimestamp}
					{#if consensusTimestamp !== undefined && consensusTimestamp !== null}
						<div>
							<dt>consensus timestamp</dt>
							<dd>
								{String((consensusTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runningHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const runningHash = prefetched.runningHash}
					{#if runningHash !== undefined && runningHash !== null}
						<div>
							<dt>running hash</dt>
							<dd>
								<TruncatedValue value={String((runningHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const runningHash = resolvedEntity.runningHash}
					{#if runningHash !== undefined && runningHash !== null}
						<div>
							<dt>running hash</dt>
							<dd>
								<TruncatedValue value={String((runningHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payerAccount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const payerAccount = prefetched.payerAccount}
					{#if payerAccount !== undefined && payerAccount !== null}
						<div>
							<dt>payer account</dt>
							<dd>
								<TruncatedValue value={String((payerAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payerAccount = resolvedEntity.payerAccount}
					{#if payerAccount !== undefined && payerAccount !== null}
						<div>
							<dt>payer account</dt>
							<dd>
								<TruncatedValue value={String((payerAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							message: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const message = prefetched.message}
					{#if message !== undefined && message !== null}
						<div>
							<dt>message</dt>
							<dd>
								{String((message) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const message = resolvedEntity.message}
					{#if message !== undefined && message !== null}
						<div>
							<dt>message</dt>
							<dd>
								{String((message) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
