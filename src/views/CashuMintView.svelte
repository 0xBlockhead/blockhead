<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CashuMint> = $props()

	const titleFallback = $derived(selection.entitySelector.mintUrl || 'Cashu mint')
	const viewDomId = $derived('cashu-mint-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CashuKeysetsView from '$/views/CashuKeysetsView.svelte'
	import CashuMint_TimestampsView from '$/views/CashuMint_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuMint}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.mintUrl || 'Cashu mint'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.mintUrl || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint URL</dt>
				<dd>
					<a
						href={selection.entitySelector.mintUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.mintUrl} />
					</a>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-cashu-mint-keysets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'cashu-mint-keyset-list',
						label: 'Keysets',
					},
				]
			}
			data-card
			class='network-view-collapsible-assets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Keysets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCashuMintKeysetList({ id, label, open })}
				<CashuKeysetsView
					selection={selection.$$keysets}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No keysets found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-cashu-mint-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'cashu-mint-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCashuMintTimestamps({ id, label, open })}
				<CashuMint_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No mint observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
