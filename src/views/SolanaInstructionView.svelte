<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaInstruction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaInstruction>>
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
	const solanaInstruction = $derived(selection({}))
	const titleFallback = $derived('solana instruction')
	const viewDomId = $derived('solana-instruction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.instructionKind === 'Instruction' && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined && pendingEntity.$transaction.$network.caip2.namespace !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined && pendingEntity.$transaction.$network.caip2.reference !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.signature !== undefined && pendingEntity.instructionKind !== undefined && pendingEntity.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$transaction.$network.caip2.namespace) + ':' + String(pendingEntity.$transaction.$network.caip2.reference))].slug ?? ''),
			signature: String(pendingEntity.$transaction.signature ?? ''),
			instructionKind: String(pendingEntity.instructionKind ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
		}) : pendingEntity.instructionKind === 'InnerInstruction' && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined && pendingEntity.$transaction.$network.caip2.namespace !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined && pendingEntity.$transaction.$network.caip2.reference !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.signature !== undefined && pendingEntity.instructionKind !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.indexInInstruction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$transaction.$network.caip2.namespace) + ':' + String(pendingEntity.$transaction.$network.caip2.reference))].slug ?? ''),
			signature: String(pendingEntity.$transaction.signature ?? ''),
			instructionKind: String(pendingEntity.instructionKind ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
			indexInInstruction: String(pendingEntity.indexInInstruction ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaInstruction}>
			{#snippet Pending()}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
					href={
						(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
							signature: String(selection.entitySelector.$transaction.signature ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
					href={
						(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
							signature: String(selection.entitySelector.$transaction.signature ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaInstruction}>
			{#snippet Pending()}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
					href={
						(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
							signature: String(selection.entitySelector.$transaction.signature ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
					href={
						(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
							signature: String(selection.entitySelector.$transaction.signature ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaInstruction}>
			{#snippet Pending()}
				{@const instructionKind0 = selection.entitySelector.instructionKind ?? prefetched.instructionKind}
				{#if instructionKind0 !== undefined && instructionKind0 !== null}
					<span data-text="muted">
						{String((instructionKind0) ?? '')}
					</span>
				{/if}
				{@const indexInTransaction1 = selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
				{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
					<span data-text="muted">
						{String((indexInTransaction1) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Instruction kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									instructionKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const instructionKind = selection.entitySelector.instructionKind ?? prefetched.instructionKind}
							{#if instructionKind !== undefined && instructionKind !== null}
								{String((instructionKind) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInTransaction = selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexInInstruction: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const indexInInstruction = prefetched.indexInInstruction}
					{#if indexInInstruction !== undefined && indexInInstruction !== null}
						<div>
							<dt>Index in instruction</dt>
							<dd>
								<NumberValue value={Number(indexInInstruction)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexInInstruction = resolvedEntity.indexInInstruction}
					{#if indexInInstruction !== undefined && indexInInstruction !== null}
						<div>
							<dt>Index in instruction</dt>
							<dd>
								<NumberValue value={Number(indexInInstruction)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parsedType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const parsedType = prefetched.parsedType}
					{#if parsedType !== undefined && parsedType !== null}
						<div>
							<dt>Parsed type</dt>
							<dd>
								{String((parsedType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							stackHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stackHeight = prefetched.stackHeight}
					{#if stackHeight !== undefined && stackHeight !== null}
						<div>
							<dt>Stack height</dt>
							<dd>
								{String((stackHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.SolanaProgram, false>('$program')}
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
										(solanaProgram[EntityMetaKey.Selector].$network !== undefined && solanaProgram[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaProgram[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaProgram[EntityMetaKey.Selector].$network !== undefined && solanaProgram[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaProgram[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaProgram[EntityMetaKey.Selector].programId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/program/[programId]', {
											networkSlug: String(networkByCaip2[String(String(solanaProgram[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaProgram[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											programId: String(solanaProgram[EntityMetaKey.Selector].programId ?? ''),
										}) : undefined)
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
							(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
								signature: String(selection.entitySelector.$transaction.signature ?? ''),
							}) : undefined)
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
		{#if detailsOpen}
			<SolanaAccountsView
				selection={selection[EntityProxyField]<EntityType.SolanaAccount>('$$accounts')}
				title='Accounts'
				emptyText='No instruction accounts.'
				id='SolanaAccountsView-$$accounts'
			/>
		{/if}
	{/snippet}
</EntityView>
