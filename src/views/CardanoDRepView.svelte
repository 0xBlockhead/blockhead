<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoDRep>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoDRep>>
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
	const cardanoDRep = $derived(selection({}))
	const titleFallback = $derived('Cardano DRep')
	const viewDomId = $derived('cardano-drep-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoNetworkView from '$/views/CardanoNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoDRep}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoDRep}>
			{#snippet Pending()}
				{title || 'Cardano DRep'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<CardanoNetworkView
						selection={select(EntityType.CardanoNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>drep credential</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									drepCredential: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const drepCredential = selection.entitySelector.drepCredential ?? prefetched.drepCredential}
							{#if drepCredential !== undefined && drepCredential !== null}
								<TruncatedValue value={String((drepCredential) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const drepCredential = resolvedEntity.drepCredential}
							{#if drepCredential !== undefined && drepCredential !== null}
								<TruncatedValue value={String((drepCredential) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							credentialKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const credentialKind = prefetched.credentialKind}
					{#if credentialKind !== undefined && credentialKind !== null}
						<div>
							<dt>credential kind</dt>
							<dd>
								<TruncatedValue value={String((credentialKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const credentialKind = resolvedEntity.credentialKind}
					{#if credentialKind !== undefined && credentialKind !== null}
						<div>
							<dt>credential kind</dt>
							<dd>
								<TruncatedValue value={String((credentialKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
