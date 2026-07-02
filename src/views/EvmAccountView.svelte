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
	import { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import { UrlString } from '$/schema/UrlString.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EvmAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmAccount>>
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

	const evmAccount = $derived(selection({
		fields: {
			avatarUrl: true,
			$primaryName: true,
			$avatar: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).address) ?? '')].filter(Boolean).join(' ') || 'EVM account')
	const viewDomId = $derived('evm-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
	import MediaView from '$/views/MediaView.svelte'
	import EnsNamesView from '$/views/EnsNamesView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/account/[address=evmAddress]', {
			address: String(({ ...selection.entitySelector, ...prefetched }).address),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={evmAccount}>
			{#snippet Pending()}
				<IconComponent icon='user' />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$avatar}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{:else}
					<IconComponent icon='user' />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String(address0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmAccount}>
				{#snippet Pending()}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
				{@const primaryName = entity.$primaryName?.[EntityMetaKey.Selector]?.name ?? entity.$primaryName?.name}
				{#if primaryName}
					{String(primaryName ?? '')}
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
			<ResourceBoundary resource={evmAccount}>
				{#snippet Pending()}
					{@const interopAddress = prefetched.interopAddress ?? selection.entitySelector.interopAddress}
					{#if interopAddress !== undefined && interopAddress !== null}
						<div>
							<dt>Interop address</dt>
							<dd>
								{String((interopAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const interopAddress = entity.interopAddress ?? selection.entitySelector.interopAddress ?? prefetched.interopAddress}
					{#if interopAddress !== undefined && interopAddress !== null}
						<div>
							<dt>Interop address</dt>
							<dd>
								{String((interopAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmAccount}>
				{#snippet Pending()}
					{@const avatarUrl = prefetched.avatarUrl ?? selection.entitySelector.avatarUrl}
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
					{@const avatarUrl = entity.avatarUrl ?? selection.entitySelector.avatarUrl ?? prefetched.avatarUrl}
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
				resource={selection[EntityProxyField]<EntityType.EnsName, false>('$primaryName')}
			>
				{#snippet children(ensName)}
					{#if ensName != null}
						<div>
							<dt>Primary name</dt>
							<dd>
								<EnsNameView
									selection={select(EntityType.EnsName, ensName.entitySelector)}
									prefetched={ensName}
									href={
										resolve('/(explore)/(ens)/ens/name/[ensName]', {
											ensName: String(ensName.entitySelector.name),
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

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.Media, false>('$avatar')}
			>
				{#snippet children(media)}
					{#if media != null}
						<div>
							<dt>Avatar</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, media.entitySelector)}
									prefetched={media}
									href={
										resolve('/(explore)/media/[url]', {
											url: String(media.entitySelector.url),
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
									Primary label and owned ENS names load from configured resolvers when available.
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
						selection={selection[EntityProxyField]<EntityType.EnsName>('$$ensNamesOwned')}
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
