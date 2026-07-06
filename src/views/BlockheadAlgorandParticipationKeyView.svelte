<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAlgorandParticipationKey>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAlgorandParticipationKey>>
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
	const blockheadAlgorandParticipationKey = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			firstValidRound: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.participationId ?? prefetched.participationId) ?? '')].filter(Boolean).join(' ') || 'blockhead algorand participation key')
	const viewDomId = $derived('blockhead-algorand-participation-key-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandAccountView from '$/views/AlgorandAccountView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAlgorandParticipationKey}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAlgorandParticipationKey}>
			{#snippet Pending()}
				{[String((selection.entitySelector.participationId ?? prefetched.participationId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead algorand participation key'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.participationId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAlgorandParticipationKey}>
			{#snippet Pending()}
				{[String((selection.entitySelector.nodeId ?? prefetched.nodeId) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.participationId ?? prefetched.participationId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead algorand participation key'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.nodeId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.participationId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAlgorandParticipationKey}>
			{#snippet Pending()}
				{@const firstValidRound0 = prefetched.firstValidRound}
				{#if firstValidRound0 !== undefined && firstValidRound0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(firstValidRound0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const firstValidRound0 = resolvedEntity.firstValidRound}
				{#if firstValidRound0 !== undefined && firstValidRound0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(firstValidRound0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nodeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const nodeId = selection.entitySelector.nodeId ?? prefetched.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nodeId = resolvedEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>participation ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									participationId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const participationId = selection.entitySelector.participationId ?? prefetched.participationId}
							{#if participationId !== undefined && participationId !== null}
								{String((participationId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const participationId = resolvedEntity.participationId}
							{#if participationId !== undefined && participationId !== null}
								{String((participationId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AlgorandAccount, false>('$account')}
			>
				{#snippet children(algorandAccount)}
					{#if algorandAccount != null && algorandAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<AlgorandAccountView
									selection={select(EntityType.AlgorandAccount, algorandAccount[EntityMetaKey.Selector])}
									prefetched={algorandAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AlgorandNetwork, false>('$network')}
			>
				{#snippet children(algorandNetwork)}
					{#if algorandNetwork != null && algorandNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<AlgorandNetworkView
									selection={select(EntityType.AlgorandNetwork, algorandNetwork[EntityMetaKey.Selector])}
									prefetched={algorandNetwork}
									layout={EntityLayout.Value}
									open={false}
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
					selection({
						fields: {
							firstValidRound: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const firstValidRound = prefetched.firstValidRound}
					{#if firstValidRound !== undefined && firstValidRound !== null}
						<div>
							<dt>first valid round</dt>
							<dd>
								<NumberValue value={Number(firstValidRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const firstValidRound = resolvedEntity.firstValidRound}
					{#if firstValidRound !== undefined && firstValidRound !== null}
						<div>
							<dt>first valid round</dt>
							<dd>
								<NumberValue value={Number(firstValidRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastValidRound: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastValidRound = prefetched.lastValidRound}
					{#if lastValidRound !== undefined && lastValidRound !== null}
						<div>
							<dt>last valid round</dt>
							<dd>
								<NumberValue value={Number(lastValidRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastValidRound = resolvedEntity.lastValidRound}
					{#if lastValidRound !== undefined && lastValidRound !== null}
						<div>
							<dt>last valid round</dt>
							<dd>
								<NumberValue value={Number(lastValidRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							keyDilution: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keyDilution = prefetched.keyDilution}
					{#if keyDilution !== undefined && keyDilution !== null}
						<div>
							<dt>key dilution</dt>
							<dd>
								<NumberValue value={Number(keyDilution)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyDilution = resolvedEntity.keyDilution}
					{#if keyDilution !== undefined && keyDilution !== null}
						<div>
							<dt>key dilution</dt>
							<dd>
								<NumberValue value={Number(keyDilution)} />
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
							selectionKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const selectionKey = prefetched.selectionKey}
					{#if selectionKey !== undefined && selectionKey !== null}
						<div>
							<dt>selection key</dt>
							<dd>
								{String((selectionKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const selectionKey = resolvedEntity.selectionKey}
					{#if selectionKey !== undefined && selectionKey !== null}
						<div>
							<dt>selection key</dt>
							<dd>
								{String((selectionKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							votingKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const votingKey = prefetched.votingKey}
					{#if votingKey !== undefined && votingKey !== null}
						<div>
							<dt>voting key</dt>
							<dd>
								{String((votingKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const votingKey = resolvedEntity.votingKey}
					{#if votingKey !== undefined && votingKey !== null}
						<div>
							<dt>voting key</dt>
							<dd>
								{String((votingKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateProofKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stateProofKey = prefetched.stateProofKey}
					{#if stateProofKey !== undefined && stateProofKey !== null}
						<div>
							<dt>state proof key</dt>
							<dd>
								{String((stateProofKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateProofKey = resolvedEntity.stateProofKey}
					{#if stateProofKey !== undefined && stateProofKey !== null}
						<div>
							<dt>state proof key</dt>
							<dd>
								{String((stateProofKey) ?? '')}
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
							effectiveFirstRound: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const effectiveFirstRound = prefetched.effectiveFirstRound}
					{#if effectiveFirstRound !== undefined && effectiveFirstRound !== null}
						<div>
							<dt>effective first round</dt>
							<dd>
								<NumberValue value={Number(effectiveFirstRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const effectiveFirstRound = resolvedEntity.effectiveFirstRound}
					{#if effectiveFirstRound !== undefined && effectiveFirstRound !== null}
						<div>
							<dt>effective first round</dt>
							<dd>
								<NumberValue value={Number(effectiveFirstRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							effectiveLastRound: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const effectiveLastRound = prefetched.effectiveLastRound}
					{#if effectiveLastRound !== undefined && effectiveLastRound !== null}
						<div>
							<dt>effective last round</dt>
							<dd>
								<NumberValue value={Number(effectiveLastRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const effectiveLastRound = resolvedEntity.effectiveLastRound}
					{#if effectiveLastRound !== undefined && effectiveLastRound !== null}
						<div>
							<dt>effective last round</dt>
							<dd>
								<NumberValue value={Number(effectiveLastRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSyncedAt = prefetched.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSyncedAt = resolvedEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
