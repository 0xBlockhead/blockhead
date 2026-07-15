<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.Eip8004ReputationFeedback_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Eip8004ReputationFeedback_Timestamp>>
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
	const eip8004ReputationFeedbackTimestamp = $derived(selection({
		sources: [
			Source.Eip8004Scan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			value: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.value) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.feedbackIndex) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 reputation feedback timestamp')
	const viewDomId = $derived('eip8004reputation-feedback-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eip8004ReputationFeedbackTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.value) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.feedbackIndex) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 reputation feedback timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.value) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eip8004ReputationFeedbackTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eip8004ReputationFeedbackTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Registration</dt>
				<dd>
					<Eip8004AgentRegistrationView
						selection={select(EntityType.Eip8004AgentRegistration, selection.entitySelector.$registration, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Client address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									clientAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const clientAddress = pendingEntity.clientAddress}
							{#if clientAddress !== undefined && clientAddress !== null}
								<TruncatedValue value={String((clientAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const clientAddress = resolvedEntity.clientAddress}
							{#if clientAddress !== undefined && clientAddress !== null}
								<TruncatedValue value={String((clientAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Feedback index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									feedbackIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const feedbackIndex = pendingEntity.feedbackIndex}
							{#if feedbackIndex !== undefined && feedbackIndex !== null}
								<NumberValue value={Number(feedbackIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feedbackIndex = resolvedEntity.feedbackIndex}
							{#if feedbackIndex !== undefined && feedbackIndex !== null}
								<NumberValue value={Number(feedbackIndex)} />
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const value = pendingEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								{String((value) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const value = resolvedEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								{String((value) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueDecimals: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueDecimals = pendingEntity.valueDecimals}
					{#if valueDecimals !== undefined && valueDecimals !== null}
						<div>
							<dt>Value decimals</dt>
							<dd>
								<NumberValue value={Number(valueDecimals)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueDecimals = resolvedEntity.valueDecimals}
					{#if valueDecimals !== undefined && valueDecimals !== null}
						<div>
							<dt>Value decimals</dt>
							<dd>
								<NumberValue value={Number(valueDecimals)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tag1: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tag1 = pendingEntity.tag1}
					{#if tag1 !== undefined && tag1 !== null}
						<div>
							<dt>Tag 1</dt>
							<dd>
								{String((tag1) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tag1 = resolvedEntity.tag1}
					{#if tag1 !== undefined && tag1 !== null}
						<div>
							<dt>Tag 1</dt>
							<dd>
								{String((tag1) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tag2: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tag2 = pendingEntity.tag2}
					{#if tag2 !== undefined && tag2 !== null}
						<div>
							<dt>Tag 2</dt>
							<dd>
								{String((tag2) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tag2 = resolvedEntity.tag2}
					{#if tag2 !== undefined && tag2 !== null}
						<div>
							<dt>Tag 2</dt>
							<dd>
								{String((tag2) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endpoint: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endpoint = pendingEntity.endpoint}
					{#if endpoint !== undefined && endpoint !== null}
						<div>
							<dt>Endpoint</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpoint)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpoint)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpoint = resolvedEntity.endpoint}
					{#if endpoint !== undefined && endpoint !== null}
						<div>
							<dt>Endpoint</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpoint)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpoint)} />
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
							feedbackUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feedbackUri = pendingEntity.feedbackUri}
					{#if feedbackUri !== undefined && feedbackUri !== null}
						<div>
							<dt>Feedback URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(feedbackUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(feedbackUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feedbackUri = resolvedEntity.feedbackUri}
					{#if feedbackUri !== undefined && feedbackUri !== null}
						<div>
							<dt>Feedback URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(feedbackUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(feedbackUri)} />
								</svelte:element>
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
							feedbackHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feedbackHashAlgorithm = pendingEntity.feedbackHashAlgorithm}
					{#if feedbackHashAlgorithm !== undefined && feedbackHashAlgorithm !== null}
						<div>
							<dt>Feedback hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((feedbackHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feedbackHashAlgorithm = resolvedEntity.feedbackHashAlgorithm}
					{#if feedbackHashAlgorithm !== undefined && feedbackHashAlgorithm !== null}
						<div>
							<dt>Feedback hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((feedbackHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feedbackHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feedbackHash = pendingEntity.feedbackHash}
					{#if feedbackHash !== undefined && feedbackHash !== null}
						<div>
							<dt>Feedback hash</dt>
							<dd>
								<TruncatedValue value={String((feedbackHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feedbackHash = resolvedEntity.feedbackHash}
					{#if feedbackHash !== undefined && feedbackHash !== null}
						<div>
							<dt>Feedback hash</dt>
							<dd>
								<TruncatedValue value={String((feedbackHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							revoked: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revoked = pendingEntity.revoked}
					{#if revoked !== undefined && revoked !== null}
						<div>
							<dt>Revoked</dt>
							<dd>
								{revoked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revoked = resolvedEntity.revoked}
					{#if revoked !== undefined && revoked !== null}
						<div>
							<dt>Revoked</dt>
							<dd>
								{revoked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockNumber = pendingEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber = resolvedEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionHash = pendingEntity.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionHash = resolvedEntity.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
