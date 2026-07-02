<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Zcash shielded pools',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Zcash shielded pools...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZcashShieldedPools-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ZcashShieldedPool>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					pool: true,
					noteProtocol: true,
					activationNetworkUpgrade: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZcashShieldedPool}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(zcashShieldedPools)}
			{@const uniqueZcashShieldedPools = [...new Map(zcashShieldedPools.values.map((zcashShieldedPool) => [zcashShieldedPool[EntityMetaKey.SelectorKey], zcashShieldedPool])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZcashShieldedPool}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={zcashShieldedPools.values.length === uniqueZcashShieldedPools.length && zcashShieldedPools.totalCount != null && zcashShieldedPools.totalCount >= uniqueZcashShieldedPools.length ? zcashShieldedPools.totalCount : uniqueZcashShieldedPools.length}
				getKey={(zcashShieldedPool) => zcashShieldedPool[EntityMetaKey.SelectorKey]}
				items={uniqueZcashShieldedPools}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Zcash shielded pools yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: zcashShieldedPool }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ZcashShieldedPool> })}
					<ZcashShieldedPoolView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/zcash/shielded-pool/[pool]', {
								networkSlug: String(({ ...zcashShieldedPool.entitySelector, ...zcashShieldedPool }).$network.slug),
								pool: String(({ ...zcashShieldedPool.entitySelector, ...zcashShieldedPool }).pool),
							})
						}
						selection={select(EntityType.ZcashShieldedPool, zcashShieldedPool.entitySelector)}
						prefetched={zcashShieldedPool}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.ZcashShieldedPool}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
