<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.Eip8004ReputationFeedback_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const eip8004ReputationFeedbackTimestamp = $derived(viewSelection({
		fields: {
			value: true,
		},
	}))
	const titleFallback = $derived((prefetched.value ?? '') || String(selection.entitySelector.feedbackIndex) || 'EIP-8004 reputation feedback timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eip8004ReputationFeedbackTimestamp}>
			{#snippet children(entity)}
				{(entity.value ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Registration</dt>
				<dd>
					<Eip8004AgentRegistrationView
						selection={select(EntityType.Eip8004AgentRegistration, selection.entitySelector.$registration)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Client address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.clientAddress} />
				</dd>
			</div>

			<div>
				<dt>Feedback index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.feedbackIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={eip8004ReputationFeedbackTimestamp}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								{value}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							valueDecimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueDecimals = entity.valueDecimals}
					{#if valueDecimals != null}
						<div>
							<dt>Value decimals</dt>
							<dd>
								<NumberValue
									value={valueDecimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tag1: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tag1 = entity.tag1}
					{#if tag1 != null}
						<div>
							<dt>Tag 1</dt>
							<dd>
								{tag1}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tag2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tag2 = entity.tag2}
					{#if tag2 != null}
						<div>
							<dt>Tag 2</dt>
							<dd>
								{tag2}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							endpoint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endpoint = entity.endpoint}
					{#if endpoint != null}
						<div>
							<dt>Endpoint</dt>
							<dd>
								<a
									href={endpoint}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={endpoint} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							feedbackUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feedbackUri = entity.feedbackUri}
					{#if feedbackUri != null}
						<div>
							<dt>Feedback URI</dt>
							<dd>
								<a
									href={feedbackUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={feedbackUri} />
								</a>
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
							feedbackHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feedbackHashAlgorithm = entity.feedbackHashAlgorithm}
					{#if feedbackHashAlgorithm != null}
						<div>
							<dt>Feedback hash algorithm</dt>
							<dd>
								{feedbackHashAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							feedbackHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feedbackHash = entity.feedbackHash}
					{#if feedbackHash != null}
						<div>
							<dt>Feedback hash</dt>
							<dd>
								<TruncatedValue value={feedbackHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							revoked: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revoked = entity.revoked}
					{#if revoked != null}
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
					viewSelection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionHash = entity.transactionHash}
					{#if transactionHash != null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={transactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
