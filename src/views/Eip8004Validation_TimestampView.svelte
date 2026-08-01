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
	}: EntitySelectionViewProps<EntityType.Eip8004Validation_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const eip8004ValidationTimestamp = $derived(viewSelection({
		fields: {
			response: true,
			validatorAddress: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.requestHash || 'EIP-8004 validation timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004Validation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={eip8004ValidationTimestamp}>
			{#snippet children(entity)}
				{String(entity.response ?? '') || selection.entitySelector.requestHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eip8004ValidationTimestamp}>
			{#snippet children(entity)}
				{@const validatorAddress = entity.validatorAddress}
				{#if validatorAddress != null}
					<span data-text="muted">
						<TruncatedValue value={validatorAddress} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Request hash algorithm</dt>
				<dd>
					{selection.entitySelector.requestHashAlgorithm}
				</dd>
			</div>

			<div>
				<dt>Request hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.requestHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$registration}
			>
				{#snippet children(eip8004AgentRegistration)}
					{#if eip8004AgentRegistration != null}
						<div>
							<dt>Registration</dt>
							<dd>
								<Eip8004AgentRegistrationView
									selection={select(EntityType.Eip8004AgentRegistration, eip8004AgentRegistration[EntityMetaKey.Selector])}
									prefetched={eip8004AgentRegistration}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={eip8004ValidationTimestamp}
			>
				{#snippet children(entity)}
					{@const validatorAddress = entity.validatorAddress}
					{#if validatorAddress != null}
						<div>
							<dt>Validator address</dt>
							<dd>
								<TruncatedValue value={validatorAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={eip8004ValidationTimestamp}
			>
				{#snippet children(entity)}
					{@const response = entity.response}
					{#if response != null}
						<div>
							<dt>Response</dt>
							<dd>
								<NumberValue
									value={response}
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
							requestUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestUri = entity.requestUri}
					{#if requestUri != null}
						<div>
							<dt>Request URI</dt>
							<dd>
								<a
									href={requestUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={requestUri} />
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
							responseUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const responseUri = entity.responseUri}
					{#if responseUri != null}
						<div>
							<dt>Response URI</dt>
							<dd>
								<a
									href={responseUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={responseUri} />
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
							responseHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const responseHashAlgorithm = entity.responseHashAlgorithm}
					{#if responseHashAlgorithm != null}
						<div>
							<dt>Response hash algorithm</dt>
							<dd>
								{responseHashAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							responseHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const responseHash = entity.responseHash}
					{#if responseHash != null}
						<div>
							<dt>Response hash</dt>
							<dd>
								<TruncatedValue value={responseHash} />
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
							tag: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tag = entity.tag}
					{#if tag != null}
						<div>
							<dt>Tag</dt>
							<dd>
								{tag}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastUpdate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastUpdate = entity.lastUpdate}
					{#if lastUpdate != null}
						<div>
							<dt>Last update</dt>
							<dd>
								<Timestamp timestamp={lastUpdate} />
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
