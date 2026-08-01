<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.EvmAccount> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const viewDomId = $derived('evm-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
	import EnsNamesView from '$/views/EnsNamesView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.address || 'EVM account')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/account/[address=evmAddress]',
				{
					address: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources ?? [
						Source.Constants_Internal,
					],
				})
			}
		>
			{#snippet Pending()}
				<TruncatedValue
					value={selection.entitySelector.address}
				/>
			{/snippet}

			{#snippet children(entity)}
				{#if entity.$primaryName != null}
					{@const primaryName = entity.$primaryName[EntityMetaKey.Selector].name ?? entity.$primaryName.name}
					{#if primaryName}
						{primaryName}
					{:else}
						<TruncatedValue
							value={selection.entitySelector.address}
						/>
					{/if}
				{:else}
					<TruncatedValue
						value={selection.entitySelector.address}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							interopAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const interopAddress = entity.interopAddress}
					{#if interopAddress != null}
						<div>
							<dt>Interop address</dt>
							<dd>
								<TruncatedValue value={interopAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							avatarUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const avatarUrl = entity.avatarUrl}
					{#if avatarUrl != null}
						<div>
							<dt>Avatar URL</dt>
							<dd>
								<a
									href={avatarUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={avatarUrl} />
								</a>
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
				{#snippet children(ensName)}
					{#if ensName != null}
						<div>
							<dt>Primary name</dt>
							<dd>
								<EnsNameView
									selection={select(EntityType.EnsName, ensName[EntityMetaKey.Selector])}
									prefetched={ensName}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Identity</HeadingComponent>
					<Tooltip>
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
					selection={selection.$$ensNamesOwned}
					collapsible={false}
					title={label}
					emptyText='No ENS names owned by this account yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
