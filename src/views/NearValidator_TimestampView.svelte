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
			selection: EntityProxyResource<typeof schema, EntityType.NearValidator_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearValidator_Timestamp>>
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
	const nearValidatorTimestamp = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			validatorSetRole: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.epochId ?? prefetched.epochId) ?? '')].filter(Boolean).join(' ') || 'near validator timestamp')
	const viewDomId = $derived('near-validator-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearValidatorView from '$/views/NearValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.NearValidator_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearValidatorTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.epochId ?? prefetched.epochId) ?? '')].filter(Boolean).join(' ') || title || 'near validator timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.epochId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearValidatorTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.validatorSetRole) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.epochId ?? prefetched.epochId) ?? '')].filter(Boolean).join(' ') || title || 'near validator timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.validatorSetRole) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.epochId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearValidatorTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Validator</dt>
				<dd>
					<NearValidatorView
						selection={select(EntityType.NearValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Epoch ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									epochId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const epochId = selection.entitySelector.epochId ?? prefetched.epochId}
							{#if epochId !== undefined && epochId !== null}
								{String((epochId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const epochId = resolvedEntity.epochId}
							{#if epochId !== undefined && epochId !== null}
								{String((epochId) ?? '')}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							epochHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epochHeight = prefetched.epochHeight}
					{#if epochHeight !== undefined && epochHeight !== null}
						<div>
							<dt>Epoch height</dt>
							<dd>
								<NumberValue value={Number(epochHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epochHeight = resolvedEntity.epochHeight}
					{#if epochHeight !== undefined && epochHeight !== null}
						<div>
							<dt>Epoch height</dt>
							<dd>
								<NumberValue value={Number(epochHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							epochStartHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epochStartHeight = prefetched.epochStartHeight}
					{#if epochStartHeight !== undefined && epochStartHeight !== null}
						<div>
							<dt>Epoch start height</dt>
							<dd>
								<NumberValue value={Number(epochStartHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epochStartHeight = resolvedEntity.epochStartHeight}
					{#if epochStartHeight !== undefined && epochStartHeight !== null}
						<div>
							<dt>Epoch start height</dt>
							<dd>
								<NumberValue value={Number(epochStartHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							validatorSetRole: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validatorSetRole = prefetched.validatorSetRole}
					{#if validatorSetRole !== undefined && validatorSetRole !== null}
						<div>
							<dt>Validator set role</dt>
							<dd>
								{String((validatorSetRole) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validatorSetRole = resolvedEntity.validatorSetRole}
					{#if validatorSetRole !== undefined && validatorSetRole !== null}
						<div>
							<dt>Validator set role</dt>
							<dd>
								{String((validatorSetRole) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							publicKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publicKey = prefetched.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={String((publicKey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publicKey = resolvedEntity.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={String((publicKey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							stakeYoctoNear: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakeYoctoNear = prefetched.stakeYoctoNear}
					{#if stakeYoctoNear !== undefined && stakeYoctoNear !== null}
						<div>
							<dt>Stake yocto near</dt>
							<dd>
								<NumberValue value={Number(stakeYoctoNear)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeYoctoNear = resolvedEntity.stakeYoctoNear}
					{#if stakeYoctoNear !== undefined && stakeYoctoNear !== null}
						<div>
							<dt>Stake yocto near</dt>
							<dd>
								<NumberValue value={Number(stakeYoctoNear)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							isSlashed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isSlashed = prefetched.isSlashed}
					{#if isSlashed !== undefined && isSlashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{isSlashed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isSlashed = resolvedEntity.isSlashed}
					{#if isSlashed !== undefined && isSlashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{isSlashed ? 'Yes' : 'No'}
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
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							expectedBlocks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expectedBlocks = prefetched.expectedBlocks}
					{#if expectedBlocks !== undefined && expectedBlocks !== null}
						<div>
							<dt>Expected blocks</dt>
							<dd>
								<NumberValue value={Number(expectedBlocks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expectedBlocks = resolvedEntity.expectedBlocks}
					{#if expectedBlocks !== undefined && expectedBlocks !== null}
						<div>
							<dt>Expected blocks</dt>
							<dd>
								<NumberValue value={Number(expectedBlocks)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							producedBlocks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const producedBlocks = prefetched.producedBlocks}
					{#if producedBlocks !== undefined && producedBlocks !== null}
						<div>
							<dt>Produced blocks</dt>
							<dd>
								<NumberValue value={Number(producedBlocks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const producedBlocks = resolvedEntity.producedBlocks}
					{#if producedBlocks !== undefined && producedBlocks !== null}
						<div>
							<dt>Produced blocks</dt>
							<dd>
								<NumberValue value={Number(producedBlocks)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							expectedChunks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expectedChunks = prefetched.expectedChunks}
					{#if expectedChunks !== undefined && expectedChunks !== null}
						<div>
							<dt>Expected chunks</dt>
							<dd>
								<NumberValue value={Number(expectedChunks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expectedChunks = resolvedEntity.expectedChunks}
					{#if expectedChunks !== undefined && expectedChunks !== null}
						<div>
							<dt>Expected chunks</dt>
							<dd>
								<NumberValue value={Number(expectedChunks)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							producedChunks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const producedChunks = prefetched.producedChunks}
					{#if producedChunks !== undefined && producedChunks !== null}
						<div>
							<dt>Produced chunks</dt>
							<dd>
								<NumberValue value={Number(producedChunks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const producedChunks = resolvedEntity.producedChunks}
					{#if producedChunks !== undefined && producedChunks !== null}
						<div>
							<dt>Produced chunks</dt>
							<dd>
								<NumberValue value={Number(producedChunks)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Shards</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									shards: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const shards = prefetched.shards}
							{#if shards !== undefined && shards !== null}
								{(shards?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const shards = resolvedEntity.shards}
							{#if shards !== undefined && shards !== null}
								{(shards?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
