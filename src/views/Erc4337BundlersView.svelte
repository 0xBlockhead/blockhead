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
		title = 'ERC-4337 bundlers',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Bundlers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Erc4337Bundler>
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
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
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
					address: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(erc4337Bundlers)}
			{@const uniqueErc4337Bundlers = [...new Map(erc4337Bundlers.values.map((erc4337Bundler) => [erc4337Bundler[EntityMetaKey.SelectorKey], erc4337Bundler])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337Bundler}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={erc4337Bundlers.totalCount}
				getKey={(erc4337Bundler) => erc4337Bundler[EntityMetaKey.SelectorKey]}
				items={uniqueErc4337Bundlers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ERC-4337 bundlers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: erc4337Bundler }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Erc4337Bundler> })}
					{@const erc4337BundlerFields = { ...erc4337Bundler[EntityMetaKey.Selector], ...erc4337Bundler }}
					{@const erc4337BundlerHrefFields = { ...erc4337Bundler, ...erc4337Bundler[EntityMetaKey.Selector] }}
					<Erc4337BundlerView
						selection={select(EntityType.Erc4337Bundler, erc4337Bundler[EntityMetaKey.Selector])}
						prefetched={erc4337BundlerFields}
						href={
							(erc4337BundlerHrefFields.$network !== undefined && erc4337BundlerHrefFields.$network.caip2 !== undefined && erc4337BundlerHrefFields.$network.caip2.namespace !== undefined && erc4337BundlerHrefFields.$network !== undefined && erc4337BundlerHrefFields.$network.caip2 !== undefined && erc4337BundlerHrefFields.$network.caip2.reference !== undefined && erc4337BundlerHrefFields.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundler/[address=evmAddress]', {
								caip2: `${String(erc4337BundlerHrefFields.$network.caip2.namespace ?? '')}:${String(erc4337BundlerHrefFields.$network.caip2.reference ?? '')}`,
								address: String(erc4337BundlerHrefFields.address ?? ''),
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
		entityType={EntityType.Erc4337Bundler}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
