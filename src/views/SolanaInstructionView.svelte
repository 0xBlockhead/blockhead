<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.SolanaInstruction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.SolanaInstruction>
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
	const solanaInstruction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'solana instruction'
	const viewDomId = $derived('solana-instruction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaInstruction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'instructionKind' in selection.entitySelector
			&& selection.entitySelector.instructionKind != null
			&& selection.entitySelector != null && 'indexInTransaction' in selection.entitySelector
			&& selection.entitySelector.indexInTransaction != null ?
				selection.entitySelector.indexInTransaction != null
				&& selection.entitySelector != null && '$transaction' in selection.entitySelector
				&& selection.entitySelector.$transaction != null && 'signature' in selection.entitySelector.$transaction
				&& selection.entitySelector.$transaction.signature != null
				&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction
				&& selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
				&& selection.entitySelector.$transaction.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
				instructionKind: String(selection.entitySelector.instructionKind ?? ''),
				indexInTransaction: String(selection.entitySelector.indexInTransaction ?? ''),
				transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.indexInTransaction != null
					&& selection.entitySelector != null && '$transaction' in selection.entitySelector
					&& selection.entitySelector.$transaction != null && 'signature' in selection.entitySelector.$transaction
					&& selection.entitySelector.$transaction.signature != null
					&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction
					&& selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
					&& selection.entitySelector.$transaction.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
					instructionKind: String(selection.entitySelector.instructionKind ?? ''),
					indexInTransaction: String(selection.entitySelector.indexInTransaction ?? ''),
					transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
					network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
				})
				:
						selection.entitySelector.indexInTransaction != null
						&& selection.entitySelector != null && 'indexInInstruction' in selection.entitySelector
						&& selection.entitySelector.indexInInstruction != null
						&& selection.entitySelector != null && '$transaction' in selection.entitySelector
						&& selection.entitySelector.$transaction != null && 'signature' in selection.entitySelector.$transaction
						&& selection.entitySelector.$transaction.signature != null
						&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction
						&& selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
						&& selection.entitySelector.$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
						instructionKind: String(selection.entitySelector.instructionKind ?? ''),
						indexInTransaction: String(selection.entitySelector.indexInTransaction ?? ''),
						indexInInstruction: String(selection.entitySelector.indexInInstruction ?? ''),
						transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
						network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
					})
					:
							selection.entitySelector.indexInTransaction != null
							&& selection.entitySelector != null && 'indexInInstruction' in selection.entitySelector
							&& selection.entitySelector.indexInInstruction != null
							&& selection.entitySelector != null && '$transaction' in selection.entitySelector
							&& selection.entitySelector.$transaction != null && 'signature' in selection.entitySelector.$transaction
							&& selection.entitySelector.$transaction.signature != null
							&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction
							&& selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
							&& selection.entitySelector.$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
							instructionKind: String(selection.entitySelector.instructionKind ?? ''),
							indexInTransaction: String(selection.entitySelector.indexInTransaction ?? ''),
							indexInInstruction: String(selection.entitySelector.indexInInstruction ?? ''),
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
						})
						:
							undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$transaction') && prefetched.$transaction != null && Object.hasOwn(prefetched.$transaction, 'status')}
			{@const solanaTransaction0 = pendingEntity.$transaction}
			{#if solanaTransaction0 != null && selection.entitySelector.$transaction != null}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction, { sources: selection.sources })}
					prefetched={solanaTransaction0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet children(entity)}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$transaction') && prefetched.$transaction != null && Object.hasOwn(prefetched.$transaction, 'status')}
			{@const solanaTransaction0 = pendingEntity.$transaction}
			{#if solanaTransaction0 != null && selection.entitySelector.$transaction != null}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction, { sources: selection.sources })}
					prefetched={solanaTransaction0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet children(entity)}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$transaction') && prefetched.$transaction != null && Object.hasOwn(prefetched.$transaction, 'status')}
			{@const instructionKind0 = pendingEntity.instructionKind}
			{#if instructionKind0 !== undefined && instructionKind0 !== null}
				<span data-text="muted">
					{String((instructionKind0) ?? '')}
				</span>
			{/if}
			{@const indexInTransaction1 = pendingEntity.indexInTransaction}
			{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
				<span data-text="muted">
					{String((indexInTransaction1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const instructionKind0 = resolvedEntity.instructionKind}
					{#if instructionKind0 !== undefined && instructionKind0 !== null}
						<span data-text="muted">
							{String((instructionKind0) ?? '')}
						</span>
					{/if}
					{@const indexInTransaction1 = resolvedEntity.indexInTransaction}
					{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
						<span data-text="muted">
							{String((indexInTransaction1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Instruction kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									instructionKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const instructionKind = resolvedEntity.instructionKind}
							{#if instructionKind !== undefined && instructionKind !== null}
								{String((instructionKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Index in transaction</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue
									value={indexInTransaction}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							indexInInstruction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexInInstruction = resolvedEntity.indexInInstruction}
					{#if indexInInstruction !== undefined && indexInInstruction !== null}
						<div>
							<dt>Index in instruction</dt>
							<dd>
								<NumberValue
									value={indexInInstruction}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							parsedType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parsedType = resolvedEntity.parsedType}
					{#if parsedType !== undefined && parsedType !== null}
						<div>
							<dt>Parsed type</dt>
							<dd>
								{String((parsedType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							stackHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stackHeight = resolvedEntity.stackHeight}
					{#if stackHeight !== undefined && stackHeight !== null}
						<div>
							<dt>Stack height</dt>
							<dd>
								{String((stackHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$program}
			>
				{#snippet children(solanaProgram)}
					{#if solanaProgram != null && solanaProgram[EntityMetaKey.Selector] != null}
						<div>
							<dt>Program</dt>
							<dd>
								<SolanaProgramView
									selection={select(EntityType.SolanaProgram, solanaProgram[EntityMetaKey.Selector])}
									prefetched={solanaProgram}
									href={
										(
											solanaProgram[EntityMetaKey.Selector] != null && 'programId' in solanaProgram[EntityMetaKey.Selector]
											&& solanaProgram[EntityMetaKey.Selector].programId != null
											&& solanaProgram[EntityMetaKey.Selector] != null && '$network' in solanaProgram[EntityMetaKey.Selector] ?
												solanaProgram[EntityMetaKey.Selector].$network != null && 'caip2' in solanaProgram[EntityMetaKey.Selector].$network
												&& solanaProgram[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
												programId: String(solanaProgram[EntityMetaKey.Selector].programId ?? ''),
												network: String(caip2StringFromValue(solanaProgram[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													solanaProgram[EntityMetaKey.Selector].$network != null && 'slug' in solanaProgram[EntityMetaKey.Selector].$network
													&& solanaProgram[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
													programId: String(solanaProgram[EntityMetaKey.Selector].programId ?? ''),
													network: String(solanaProgram[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Transaction</dt>
				<dd>
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
							(
								selection.entitySelector.$transaction != null && 'signature' in selection.entitySelector.$transaction
								&& selection.entitySelector.$transaction.signature != null
								&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
									selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
									&& selection.entitySelector.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
									transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
										&& selection.entitySelector.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
										transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
										network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						data: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const data = resolvedEntity.data}
				{#if data !== undefined && data !== null && data !== ''}
					<code>{String((data) ?? '')}</code>
				{:else}
					<p data-text="muted">No instruction data available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const solanaInstructionSolanaAccountsViewAccountsResource = selection
		.$$accounts({
			sources: [
				Source.Solana_JsonRpc,
			],
		})}
				<ResourceBoundary
					resource={solanaInstructionSolanaAccountsViewAccountsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<SolanaAccountsView
							selection={solanaInstructionSolanaAccountsViewAccountsResource}
							countResource={solanaInstructionSolanaAccountsViewAccountsResource.count}
							title='Accounts'
							id='SolanaAccountsView-accounts'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
