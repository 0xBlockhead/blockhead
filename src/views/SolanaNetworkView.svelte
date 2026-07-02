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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaNetwork>>
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

	const solanaNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			environment: true,
			...(open && {
				$$timestamps: true,
				$$blocks: true,
				$$transactions: true,
				$$accounts: true,
				$$programs: true,
				$$tokenAccounts: true,
				$$tokenMints: true,
				$$validators: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || 'Solana network')
	const viewDomId = $derived('solana-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaNetwork_TimestampsView from '$/views/SolanaNetwork_TimestampsView.svelte'
	import SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
	import SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
	import SolanaProgramsView from '$/views/SolanaProgramsView.svelte'
	import SolanaTokenAccountsView from '$/views/SolanaTokenAccountsView.svelte'
	import SolanaTokenMintsView from '$/views/SolanaTokenMintsView.svelte'
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana', {
			networkSlug: String(networkByCaip2[String(String(({ ...selection.entitySelector, ...prefetched }).caip2.namespace) + ':' + String(({ ...selection.entitySelector, ...prefetched }).caip2.reference))].slug),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'Solana network'}
		{:else}
			<ResourceBoundary resource={solanaNetwork}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'Solana network'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const caip20 = ({ ...selection.entitySelector, ...prefetched }).caip2}
			{#if caip20 !== undefined && caip20 !== null}
				<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaNetwork}>
				{#snippet Pending()}
					{@const caip20 = ({ ...selection.entitySelector, ...prefetched }).caip2}
					{#if caip20 !== undefined && caip20 !== null}
						<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const caip20 = ({ ...selection.entitySelector, ...prefetched, ...entity }).caip2}
					{#if caip20 !== undefined && caip20 !== null}
						<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Solana cluster identified by its CAIP-2 namespace and reference.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Environment</dt>
				<dd>
					<ResourceBoundary resource={solanaNetwork}>
						{#snippet Pending()}
							{@const environment = prefetched.environment ?? selection.entitySelector.environment}
							{#if environment !== undefined && environment !== null}
								{String((environment) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const environment = entity.environment ?? selection.entitySelector.environment ?? prefetched.environment}
							{#if environment !== undefined && environment !== null}
								{String((environment) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<SolanaNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.SolanaNetwork_Timestamp>('$$timestamps')}
				title='Timestamps'
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/observations', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
						})
					}
				id='SolanaNetwork_TimestampsView-$$timestamps'
			/>

			<SolanaBlocksView
				selection={selection[EntityProxyField]<EntityType.SolanaBlock>('$$blocks')}
				title='Blocks'
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/blocks', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
						})
					}
				id='SolanaBlocksView-$$blocks'
			/>

			<SolanaTransactionsView
				selection={selection[EntityProxyField]<EntityType.SolanaTransaction>('$$transactions')}
				title='Transactions'
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/transactions', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
						})
					}
				id='SolanaTransactionsView-$$transactions'
			/>

			<SolanaAccountsView
				selection={selection[EntityProxyField]<EntityType.SolanaAccount>('$$accounts')}
				title='Accounts'
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/accounts', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
						})
					}
				id='SolanaAccountsView-$$accounts'
			/>

			<SolanaProgramsView
				selection={selection[EntityProxyField]<EntityType.SolanaProgram>('$$programs')}
				title='Programs'
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/programs', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
						})
					}
				id='SolanaProgramsView-$$programs'
			/>

			<SolanaTokenAccountsView
				selection={selection[EntityProxyField]<EntityType.SolanaTokenAccount>('$$tokenAccounts')}
				title='Token accounts'
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-accounts', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
						})
					}
				id='SolanaTokenAccountsView-$$tokenAccounts'
			/>

			<SolanaTokenMintsView
				selection={selection[EntityProxyField]<EntityType.SolanaTokenMint>('$$tokenMints')}
				title='Token mints'
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-mints', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
						})
					}
				id='SolanaTokenMintsView-$$tokenMints'
			/>

			<SolanaValidatorsView
				selection={selection[EntityProxyField]<EntityType.SolanaValidator>('$$validators')}
				title='Validators'
				href={
						resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/validators', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
						})
					}
				id='SolanaValidatorsView-$$validators'
			/>

			<CollapsibleTabs
				id={viewDomId + '-carousel-Activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'blocks',
							label: 'Blocks',
						},
						{
							id: 'transactions',
							label: 'Transactions',
						},
						{
							id: 'accounts',
							label: 'Accounts',
						},
						{
							id: 'programs',
							label: 'Programs',
						},
						{
							id: 'timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBlocks({ id, label, open })}
					<SolanaBlocksView
						selection={selection[EntityProxyField]<EntityType.SolanaBlock>('$$blocks')}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/blocks', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTransactions({ id, label, open })}
					<SolanaTransactionsView
						selection={selection[EntityProxyField]<EntityType.SolanaTransaction>('$$transactions')}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/transactions', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAccounts({ id, label, open })}
					<SolanaAccountsView
						selection={selection[EntityProxyField]<EntityType.SolanaAccount>('$$accounts')}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/accounts', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionPrograms({ id, label, open })}
					<SolanaProgramsView
						selection={selection[EntityProxyField]<EntityType.SolanaProgram>('$$programs')}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/programs', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTimestamps({ id, label, open })}
					<SolanaNetwork_TimestampsView
						selection={selection[EntityProxyField]<EntityType.SolanaNetwork_Timestamp>('$$timestamps')}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/observations', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-AssetsAndStake'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'token-accounts',
							label: 'Token accounts',
						},
						{
							id: 'token-mints',
							label: 'Token mints',
						},
						{
							id: 'validators',
							label: 'Validators',
						},
					]
				}
				data-card
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Assets and stake</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTokenAccounts({ id, label, open })}
					<SolanaTokenAccountsView
						selection={selection[EntityProxyField]<EntityType.SolanaTokenAccount>('$$tokenAccounts')}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-accounts', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTokenMints({ id, label, open })}
					<SolanaTokenMintsView
						selection={selection[EntityProxyField]<EntityType.SolanaTokenMint>('$$tokenMints')}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-mints', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionValidators({ id, label, open })}
					<SolanaValidatorsView
						selection={selection[EntityProxyField]<EntityType.SolanaValidator>('$$validators')}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/validators', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.caip2.namespace) + ':' + String(selection.entitySelector.caip2.reference))].slug),
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
