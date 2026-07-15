<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Zcash shielded pools',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZcashShieldedPools-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ZcashShieldedPool>
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

	const collectionSelection = $derived(selection)


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

				{#snippet Item({ item: zcashShieldedPool })}
					{@const zcashShieldedPoolFields = { ...zcashShieldedPool[EntityMetaKey.Selector], ...zcashShieldedPool }}
					{@const selection = select(EntityType.ZcashShieldedPool, zcashShieldedPool[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const zcashShieldedPoolHrefFields = { ...zcashShieldedPool, ...zcashShieldedPool[EntityMetaKey.Selector] }}
					<ZcashShieldedPoolView
						selection={selection}
						prefetched={zcashShieldedPoolFields}
						href={
							(zcashShieldedPoolHrefFields.pool !== undefined && zcashShieldedPoolHrefFields.$network !== undefined && zcashShieldedPoolHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
								pool: String(zcashShieldedPoolHrefFields.pool ?? ''),
								network: String(caip2StringFromValue(zcashShieldedPoolHrefFields.$network.caip2) ?? ''),
							}) : zcashShieldedPoolHrefFields.pool !== undefined && zcashShieldedPoolHrefFields.$network !== undefined && zcashShieldedPoolHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
								pool: String(zcashShieldedPoolHrefFields.pool ?? ''),
								network: String(zcashShieldedPoolHrefFields.$network.slug ?? ''),
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
