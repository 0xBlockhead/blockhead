<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CashuMint>, 'prefetched'> = $props()

	const titleFallback = $derived(selection.entitySelector.mintUrl || 'Cashu mint')
	const viewDomId = $derived('cashu-mint-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CashuKeysetsView from '$/views/CashuKeysetsView.svelte'
	import CashuMint_TimestampsView from '$/views/CashuMint_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuMint}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/cashu/mint/[mintUrl=absoluteUrl]',
				{
					mintUrl: encodeURIComponent(selection.entitySelector.mintUrl),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.mintUrl || titleFallback}
	{/snippet}

	{#snippet Content()}
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

	{#snippet Details()}
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

			{#snippet SectionCashuMintKeysetList({ id, label })}
				<CashuKeysetsView
					selection={selection.$$keysets}
					collapsible={false}
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

			{#snippet SectionCashuMintTimestamps({ id, label })}
				<CashuMint_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No mint observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
