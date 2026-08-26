<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SolanaTokenMint>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('solana-token-mint-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import SolanaTokenMint_TimestampsView from '$/views/SolanaTokenMint_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenMint}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.mintAddress || 'solana token mint')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					mintAddress: selection.entitySelector.mintAddress,
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
		<TruncatedValue value={selection.entitySelector.mintAddress} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.mintAddress} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Mint address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.mintAddress} />
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-solana-token-mint-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'solana-token-mint-timestamps',
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

			{#snippet SectionSolanaTokenMintTimestamps({ id, label })}
				<SolanaTokenMint_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No token mint observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
