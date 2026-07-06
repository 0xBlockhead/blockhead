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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Zcash shielded pools',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				fields: {
					pool: true,
					noteProtocol: true,
					activationNetworkUpgrade: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={zcashShieldedPools.totalCount}
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
					{@const zcashShieldedPoolFields = { ...zcashShieldedPool[EntityMetaKey.Selector], ...zcashShieldedPool }}
					{@const zcashShieldedPoolHrefFields = { ...zcashShieldedPool, ...zcashShieldedPool[EntityMetaKey.Selector] }}
					<ZcashShieldedPoolView
						selection={select(EntityType.ZcashShieldedPool, zcashShieldedPool[EntityMetaKey.Selector])}
						prefetched={zcashShieldedPoolFields}
						href={
							(zcashShieldedPoolHrefFields.$network !== undefined && zcashShieldedPoolHrefFields.$network.caip2 !== undefined && zcashShieldedPoolHrefFields.$network.caip2.namespace !== undefined && zcashShieldedPoolHrefFields.$network !== undefined && zcashShieldedPoolHrefFields.$network.caip2 !== undefined && zcashShieldedPoolHrefFields.$network.caip2.reference !== undefined && zcashShieldedPoolHrefFields.pool !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/shielded-pool/[pool]', {
								networkSlug: String(networkByCaip2[String(String(zcashShieldedPoolHrefFields.$network.caip2.namespace) + ':' + String(zcashShieldedPoolHrefFields.$network.caip2.reference))].slug ?? ''),
								pool: String(zcashShieldedPoolHrefFields.pool ?? ''),
							}) : undefined)
						}
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
