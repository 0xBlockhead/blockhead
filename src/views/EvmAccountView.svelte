<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import { UrlString } from '$/schema/UrlString.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.EvmAccount>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmAccount>>
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
	const evmAccount = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
	}))
	const titleFallback = $derived([String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'EVM account')
	const viewDomId = $derived('evm-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
	import EnsNamesView from '$/views/EnsNamesView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.address !== undefined ? resolve('/account/[address=evmAddress]', {
			address: String(pendingEntity.address ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmAccount}>
			{#snippet Pending()}
				{@const address0 = pendingEntity.address}
				{#if address0 !== undefined && address0 !== null}
					<TruncatedValue value={String((address0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const address0 = resolvedEntity.address}
				{#if address0 !== undefined && address0 !== null}
					<TruncatedValue value={String((address0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmAccount}>
			{#snippet Pending()}
				<TruncatedValue
					format={TruncatedValueFormat.Visual}
					value={String(selection.entitySelector.address)}
				/>
			{/snippet}

			{#snippet children(entity)}
				{#if entity.$primaryName != null}
					{@const primaryName = entity.$primaryName[EntityMetaKey.Selector].name ?? entity.$primaryName.name}
					{#if primaryName}
						{String(primaryName ?? '')}
					{:else}
						<TruncatedValue
							format={TruncatedValueFormat.Visual}
							value={String(selection.entitySelector.address)}
						/>
					{/if}
				{:else}
					<TruncatedValue
						format={TruncatedValueFormat.Visual}
						value={String(selection.entitySelector.address)}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An account address in the EVM address space, independent of any one chain.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const address = pendingEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							interopAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const interopAddress = pendingEntity.interopAddress}
					{#if interopAddress !== undefined && interopAddress !== null}
						<div>
							<dt>Interop address</dt>
							<dd>
								<TruncatedValue value={String((interopAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const interopAddress = resolvedEntity.interopAddress}
					{#if interopAddress !== undefined && interopAddress !== null}
						<div>
							<dt>Interop address</dt>
							<dd>
								<TruncatedValue value={String((interopAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							avatarUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const avatarUrl = pendingEntity.avatarUrl}
					{#if avatarUrl !== undefined && avatarUrl !== null}
						<div>
							<dt>Avatar URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(avatarUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(avatarUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const avatarUrl = resolvedEntity.avatarUrl}
					{#if avatarUrl !== undefined && avatarUrl !== null}
						<div>
							<dt>Avatar URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(avatarUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(avatarUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$primaryName}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(ensName)}
					{#if ensName != null && ensName[EntityMetaKey.Selector] != null}
						<div>
							<dt>Primary name</dt>
							<dd>
								<EnsNameView
									selection={select(EntityType.EnsName, ensName[EntityMetaKey.Selector])}
									prefetched={ensName}
									href={
										(ensName[EntityMetaKey.Selector].name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
											ensName: String(ensName[EntityMetaKey.Selector].name ?? ''),
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-identity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'actor-ens',
							label: 'Labels',
						},
					]
				}
				data-card
				class='actor-view-collapsible-identity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Identity</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Primary label and owned ENS names are resolver-backed identity evidence for this account.
								</p>
							{/snippet}

							<abbr
								class="entity-heading-tip"
								aria-label='Identity help'
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet SectionActorEns({ id, label, open })}
					<EnsNamesView
						selection={
							selection.$$ensNamesOwned({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ENS names owned by this account yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
