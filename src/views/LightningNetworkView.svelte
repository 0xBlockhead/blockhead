<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// State
	let {
		entityId,
		href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LightningNetwork>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const lightningNetwork = useEntity(
		EntityType.LightningNetwork,
		entityId,
		{
			$: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
			name: {},
			$settlementNetwork: {},
			$$timestamps: {
				$limit: 1,
			},
		},
	)

	const settlementNetwork = useEntity(
		EntityType.Network,
		entityId.$network,
		{
			$: [
				Source.Constants_Internal,
			],
			$$nativeAssets: {},
			$$blockExplorerUrls: {},
			$$faucetUrls: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import LightningInvoicesView from '$/views/LightningInvoicesView.svelte'
	import LightningNetwork_TimestampView from '$/views/LightningNetwork_TimestampView.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
	import LightningPaymentsView from '$/views/LightningPaymentsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork}
	{entityId}
	{href}
	title="Lightning Network"
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary
			resource={lightningNetwork}
		>
			{#snippet children(row)}
				{row.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			The Lightning Network is a Bitcoin payment-channel network and protocol; it is not a base-layer chain.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={lightningNetwork}
			placeholderText="Loading Lightning Network…"
		>
			{#snippet children(row)}
				<dl>
					{#if row.$settlementNetwork != null}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									entityId={row.$settlementNetwork[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#each row.$$timestamps as timestamp (stringify(timestamp[EntityMetaKey.Id]))}
						<div>
							<dt>Latest snapshot</dt>
							<dd>
								<LightningNetwork_TimestampView
									entityId={timestamp[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/each}
				</dl>

			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${stringify(entityId)}:carousel-lightning`}
			sectionIdPrefix={stringify(entityId)}
			sections={[
				{ id: 'lightning-graph-nodes', label: 'Nodes' },
				{ id: 'lightning-graph-channels', label: 'Channels' },
				{ id: 'lightning-local-payments', label: 'Local payments' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Graph</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningGraphNodes()}
				<LightningNodesView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.LightningNetwork,
						entityId,
						fieldName: '$$nodes',
					}}
					href={href == null ? '' : `${href}/nodes`}
					id={`${stringify(entityId)}:lightning-nodes-list`}
				/>
			{/snippet}

			{#snippet SectionLightningGraphChannels()}
				<LightningChannelsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.LightningNetwork,
						entityId,
						fieldName: '$$channels',
					}}
					href={href == null ? '' : `${href}/channels`}
					id={`${stringify(entityId)}:lightning-channels-list`}
				/>
			{/snippet}

			{#snippet SectionLightningLocalPayments()}
				<div data-column="gap-3">
					<LightningInvoicesView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.LightningNetwork,
							entityId,
							fieldName: '$$invoices',
						}}
						href={href == null ? '' : `${href}/invoices`}
						id={`${stringify(entityId)}:lightning-invoices-list`}
					/>

					<LightningPaymentsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.LightningNetwork,
							entityId,
							fieldName: '$$payments',
						}}
						href={href == null ? '' : `${href}/payments`}
						id={`${stringify(entityId)}:lightning-payments-list`}
					/>
				</div>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${stringify(entityId)}:carousel-lightning-assets`}
			sectionIdPrefix={stringify(entityId)}
			sections={[
				{ id: 'lightning-assets-settlement', label: 'Settlement asset' },
			]}
			data-card
			class="network-view-collapsible-assets"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningAssetsSettlement()}
				<ResourceBoundary resource={settlementNetwork}>
					{#snippet children(settlementNetwork)}
						{#if settlementNetwork.$$nativeAssets.length > 0}
							<p><strong>Settlement asset:</strong> {settlementNetwork.$$nativeAssets.length}</p>
						{:else}
							<p data-text="muted">No settlement asset mapped for this network yet.</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${stringify(entityId)}:carousel-lightning-resources`}
			sectionIdPrefix={stringify(entityId)}
			sections={[
				{ id: 'lightning-resources-faucets', label: 'Faucets' },
				{ id: 'lightning-resources-block-explorers', label: 'Block explorers' },
			]}
			data-card
			class="network-view-collapsible-resources"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningResourcesFaucets({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No faucets listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId: entityId.$network,
						fieldName: '$$faucetUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href=""
					limit={undefined}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionLightningResourcesBlockExplorers({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId: entityId.$network,
						fieldName: '$$blockExplorerUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href=""
					limit={undefined}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
