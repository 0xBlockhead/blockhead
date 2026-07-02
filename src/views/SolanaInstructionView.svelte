<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const solanaInstruction = $derived(selection({
		fields: {
			parsedType: true,
			stackHeight: true,
			$program: true,
			data: true,
		},
	}))
	const titleFallback = $derived('solana instruction')
	const viewDomId = $derived('solana-instruction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaInstruction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (({ ...selection.entitySelector, ...prefetched })?.$transaction != null && ({ ...selection.entitySelector, ...prefetched })?.instructionKind != null && ({ ...selection.entitySelector, ...prefetched })?.indexInTransaction != null && String(String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2)].slug)) !== '' && ({ ...selection.entitySelector, ...prefetched })?.$transaction?.signature != null ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2)].slug),
			signature: String(({ ...selection.entitySelector, ...prefetched }).$transaction.signature),
			instructionKind: String(({ ...selection.entitySelector, ...prefetched }).instructionKind),
			indexInTransaction: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
		}) : ({ ...selection.entitySelector, ...prefetched })?.$transaction != null && ({ ...selection.entitySelector, ...prefetched })?.instructionKind != null && ({ ...selection.entitySelector, ...prefetched })?.indexInTransaction != null && ({ ...selection.entitySelector, ...prefetched })?.indexInInstruction != null && String(String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2)].slug)) !== '' && ({ ...selection.entitySelector, ...prefetched })?.$transaction?.signature != null ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2)].slug),
			signature: String(({ ...selection.entitySelector, ...prefetched }).$transaction.signature),
			instructionKind: String(({ ...selection.entitySelector, ...prefetched }).instructionKind),
			indexInTransaction: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
			indexInInstruction: String(({ ...selection.entitySelector, ...prefetched }).indexInInstruction),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<SolanaTransactionView
				selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
							networkSlug: String(selection.entitySelector.$transaction.$network.slug),
							signature: String(selection.entitySelector.$transaction.signature),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet Pending()}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
								networkSlug: String(selection.entitySelector.$transaction.$network.slug),
								signature: String(selection.entitySelector.$transaction.signature),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
								networkSlug: String(selection.entitySelector.$transaction.$network.slug),
								signature: String(selection.entitySelector.$transaction.signature),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<SolanaTransactionView
				selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
							networkSlug: String(selection.entitySelector.$transaction.$network.slug),
							signature: String(selection.entitySelector.$transaction.signature),
						})
					}
				layout={EntityLayout.Value}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet Pending()}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
								networkSlug: String(selection.entitySelector.$transaction.$network.slug),
								signature: String(selection.entitySelector.$transaction.signature),
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
								networkSlug: String(selection.entitySelector.$transaction.$network.slug),
								signature: String(selection.entitySelector.$transaction.signature),
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const instructionKind0 = prefetched.instructionKind}
			{#if instructionKind0 !== undefined && instructionKind0 !== null}
				<span data-text="muted">
					{String((instructionKind0) ?? '')}
				</span>
			{/if}
			{@const indexInTransaction1 = prefetched.indexInTransaction}
			{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
				<span data-text="muted">
					{String((indexInTransaction1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet Pending()}
					{@const instructionKind0 = prefetched.instructionKind}
					{#if instructionKind0 !== undefined && instructionKind0 !== null}
						<span data-text="muted">
							{String((instructionKind0) ?? '')}
						</span>
					{/if}
					{@const indexInTransaction1 = prefetched.indexInTransaction}
					{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
						<span data-text="muted">
							{String((indexInTransaction1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const instructionKind0 = entity.instructionKind}
					{#if instructionKind0 !== undefined && instructionKind0 !== null}
						<span data-text="muted">
							{String((instructionKind0) ?? '')}
						</span>
					{/if}
					{@const indexInTransaction1 = entity.indexInTransaction}
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
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet Pending()}
					{@const indexInInstruction = prefetched.indexInInstruction ?? selection.entitySelector.indexInInstruction}
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
					{@const indexInInstruction = entity.indexInInstruction ?? selection.entitySelector.indexInInstruction ?? prefetched.indexInInstruction}
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

			<ResourceBoundary resource={solanaInstruction}>
				{#snippet Pending()}
					{@const parsedType = prefetched.parsedType ?? selection.entitySelector.parsedType}
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
					{@const parsedType = entity.parsedType ?? selection.entitySelector.parsedType ?? prefetched.parsedType}
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

			<ResourceBoundary resource={solanaInstruction}>
				{#snippet Pending()}
					{@const stackHeight = prefetched.stackHeight ?? selection.entitySelector.stackHeight}
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
					{@const stackHeight = entity.stackHeight ?? selection.entitySelector.stackHeight ?? prefetched.stackHeight}
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
					{#if solanaProgram != null}
						<div>
							<dt>Program</dt>
							<dd>
								<SolanaProgramView
									selection={select(EntityType.SolanaProgram, solanaProgram.entitySelector)}
									prefetched={solanaProgram}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/program/[programId]', {
											networkSlug: String(solanaProgram.entitySelector.$network.slug),
											programId: String(solanaProgram.entitySelector.programId),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={solanaInstruction}>
			{#snippet children(entity)}
				{@const data = entity.data ?? selection.entitySelector.data ?? prefetched.data}
				{#if data === undefined || data === null || data === ''}
					<p data-text="muted">No instruction data available.</p>
				{:else}
					<code>{String((data) ?? '')}</code>
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
