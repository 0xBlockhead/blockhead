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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004Validation_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Eip8004Validation_Timestamp>>
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
	const eip8004ValidationTimestamp = $derived(selection({
		sources: [
			Source.Eip8004Scan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			response: true,
			validatorAddress: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.requestHash) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 validation timestamp')
	const viewDomId = $derived('eip8004validation-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004Validation_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eip8004ValidationTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.requestHash) ?? '')].filter(Boolean).join(' ') || title || 'EIP-8004 validation timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.requestHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eip8004ValidationTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.response) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.requestHash) ?? '')].filter(Boolean).join(' ') || title || 'EIP-8004 validation timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.response) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.requestHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eip8004ValidationTimestamp}>
			{#snippet Pending()}
				{@const validatorAddress0 = pendingEntity.validatorAddress}
				{#if validatorAddress0 !== undefined && validatorAddress0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((validatorAddress0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const validatorAddress0 = resolvedEntity.validatorAddress}
				{#if validatorAddress0 !== undefined && validatorAddress0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((validatorAddress0) ?? '')} />
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestHashAlgorithm: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestHashAlgorithm = pendingEntity.requestHashAlgorithm}
							{#if requestHashAlgorithm !== undefined && requestHashAlgorithm !== null}
								<TruncatedValue value={String((requestHashAlgorithm) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestHashAlgorithm = resolvedEntity.requestHashAlgorithm}
							{#if requestHashAlgorithm !== undefined && requestHashAlgorithm !== null}
								<TruncatedValue value={String((requestHashAlgorithm) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Request hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestHash = pendingEntity.requestHash}
							{#if requestHash !== undefined && requestHash !== null}
								<TruncatedValue value={String((requestHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestHash = resolvedEntity.requestHash}
							{#if requestHash !== undefined && requestHash !== null}
								<TruncatedValue value={String((requestHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$registration}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(eip8004AgentRegistration)}
					{#if eip8004AgentRegistration != null && eip8004AgentRegistration[EntityMetaKey.Selector] != null}
						<div>
							<dt>Registration</dt>
							<dd>
								<Eip8004AgentRegistrationView
									selection={select(EntityType.Eip8004AgentRegistration, eip8004AgentRegistration[EntityMetaKey.Selector])}
									prefetched={eip8004AgentRegistration}
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
							validatorAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validatorAddress = pendingEntity.validatorAddress}
					{#if validatorAddress !== undefined && validatorAddress !== null}
						<div>
							<dt>Validator address</dt>
							<dd>
								<TruncatedValue value={String((validatorAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validatorAddress = resolvedEntity.validatorAddress}
					{#if validatorAddress !== undefined && validatorAddress !== null}
						<div>
							<dt>Validator address</dt>
							<dd>
								<TruncatedValue value={String((validatorAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							response: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const response = pendingEntity.response}
					{#if response !== undefined && response !== null}
						<div>
							<dt>Response</dt>
							<dd>
								<NumberValue value={Number(response)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const response = resolvedEntity.response}
					{#if response !== undefined && response !== null}
						<div>
							<dt>Response</dt>
							<dd>
								<NumberValue value={Number(response)} />
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
							requestUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestUri = pendingEntity.requestUri}
					{#if requestUri !== undefined && requestUri !== null}
						<div>
							<dt>Request URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(requestUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(requestUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestUri = resolvedEntity.requestUri}
					{#if requestUri !== undefined && requestUri !== null}
						<div>
							<dt>Request URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(requestUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(requestUri)} />
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
							responseUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const responseUri = pendingEntity.responseUri}
					{#if responseUri !== undefined && responseUri !== null}
						<div>
							<dt>Response URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(responseUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(responseUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseUri = resolvedEntity.responseUri}
					{#if responseUri !== undefined && responseUri !== null}
						<div>
							<dt>Response URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(responseUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(responseUri)} />
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
							responseHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const responseHashAlgorithm = pendingEntity.responseHashAlgorithm}
					{#if responseHashAlgorithm !== undefined && responseHashAlgorithm !== null}
						<div>
							<dt>Response hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((responseHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseHashAlgorithm = resolvedEntity.responseHashAlgorithm}
					{#if responseHashAlgorithm !== undefined && responseHashAlgorithm !== null}
						<div>
							<dt>Response hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((responseHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							responseHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const responseHash = pendingEntity.responseHash}
					{#if responseHash !== undefined && responseHash !== null}
						<div>
							<dt>Response hash</dt>
							<dd>
								<TruncatedValue value={String((responseHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseHash = resolvedEntity.responseHash}
					{#if responseHash !== undefined && responseHash !== null}
						<div>
							<dt>Response hash</dt>
							<dd>
								<TruncatedValue value={String((responseHash) ?? '')} />
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
							tag: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tag = pendingEntity.tag}
					{#if tag !== undefined && tag !== null}
						<div>
							<dt>Tag</dt>
							<dd>
								{String((tag) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tag = resolvedEntity.tag}
					{#if tag !== undefined && tag !== null}
						<div>
							<dt>Tag</dt>
							<dd>
								{String((tag) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastUpdate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastUpdate = pendingEntity.lastUpdate}
					{#if lastUpdate !== undefined && lastUpdate !== null}
						<div>
							<dt>Last update</dt>
							<dd>
								<Timestamp timestamp={Number(lastUpdate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastUpdate = resolvedEntity.lastUpdate}
					{#if lastUpdate !== undefined && lastUpdate !== null}
						<div>
							<dt>Last update</dt>
							<dd>
								<Timestamp timestamp={Number(lastUpdate)} />
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
