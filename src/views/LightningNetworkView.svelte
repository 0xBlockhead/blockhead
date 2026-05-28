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
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LightningNetwork>
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
			...open && {
				$$nodes: {
					$limit: 5,
				},
				$$channels: {
					$limit: 5,
				},
				$$invoices: {
					$limit: 5,
					$: [
						Source.LightningLnd_Rest,
					],
				},
				$$payments: {
					$limit: 5,
					$: [
						Source.LightningLnd_Rest,
					],
				},
			},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
	import LightningInvoiceView from '$/views/LightningInvoiceView.svelte'
	import LightningNetwork_TimestampView from '$/views/LightningNetwork_TimestampView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
	import LightningPaymentView from '$/views/LightningPaymentView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork}
	{entityId}
	title="Lightning Network"
	bind:open
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			The Lightning Network is a Bitcoin payment-channel network and protocol; it is not a base-layer chain.
		</p>
	{/snippet}

	{#snippet Title()}
		Lightning Network
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={lightningNetwork}
		>
			{#snippet children(row)}
				{row.name}
			{/snippet}
		</ResourceBoundary>
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

				{#if open && row.$$nodes.length > 0}
					<section>
						<h3>Nodes</h3>

						<ul>
							{#each row.$$nodes as node (stringify(node[EntityMetaKey.Id]))}
								<li>
									<LightningNodeView
										entityId={node[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryInline}
									/>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if open && row.$$channels.length > 0}
					<section>
						<h3>Channels</h3>

						<ul>
							{#each row.$$channels as channel (stringify(channel[EntityMetaKey.Id]))}
								<li>
									<LightningChannelView
										entityId={channel[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryInline}
									/>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if open && row.$$invoices.length > 0}
					<section>
						<h3>Invoices</h3>

						<ul>
							{#each row.$$invoices as invoice (stringify(invoice[EntityMetaKey.Id]))}
								<li>
									<LightningInvoiceView
										entityId={invoice[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryInline}
									/>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if open && row.$$payments.length > 0}
					<section>
						<h3>Payments</h3>

						<ul>
							{#each row.$$payments as payment (stringify(payment[EntityMetaKey.Id]))}
								<li>
									<LightningPaymentView
										entityId={payment[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryInline}
									/>
								</li>
							{/each}
						</ul>
					</section>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.LightningNetwork}
			{entityId}
		/>

		<CollapsibleTabs
			id={`${stringify(entityId)}:carousel-lightning`}
			sectionIdPrefix={stringify(entityId)}
			sections={[
				{ id: 'lightning-graph-nodes', label: 'Nodes' },
				{ id: 'lightning-graph-channels', label: 'Channels' },
				{ id: 'lightning-local-payments', label: 'Local payments' },
			]}
			{...{ 'data-card': '' }}
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
				<ResourceBoundary resource={lightningNetwork}>
					{#snippet children(row)}
						<ul>
							{#each row.$$nodes as node (stringify(node[EntityMetaKey.Id]))}
								<li>
									<LightningNodeView
										entityId={node[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryInline}
									/>
								</li>
							{/each}
						</ul>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLightningGraphChannels()}
				<ResourceBoundary resource={lightningNetwork}>
					{#snippet children(row)}
						<ul>
							{#each row.$$channels as channel (stringify(channel[EntityMetaKey.Id]))}
								<li>
									<LightningChannelView
										entityId={channel[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryInline}
									/>
								</li>
							{/each}
						</ul>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLightningLocalPayments()}
				<ResourceBoundary resource={lightningNetwork}>
					{#snippet children(row)}
						<div data-column="gap-3">
							<ul>
								{#each row.$$invoices as invoice (stringify(invoice[EntityMetaKey.Id]))}
									<li>
										<LightningInvoiceView
											entityId={invoice[EntityMetaKey.Id]}
											layout={EntityLayout.SummaryInline}
										/>
									</li>
								{/each}
							</ul>

							<ul>
								{#each row.$$payments as payment (stringify(payment[EntityMetaKey.Id]))}
									<li>
										<LightningPaymentView
											entityId={payment[EntityMetaKey.Id]}
											layout={EntityLayout.SummaryInline}
										/>
									</li>
								{/each}
							</ul>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
