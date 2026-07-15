<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM coin instances',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmCoinInstances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmCoinInstance>
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
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
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
					type: true,
					$network: true,
					$contract: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmCoinInstance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmCoinInstances)}
			{@const uniqueEvmCoinInstances = [...new Map(evmCoinInstances.values.map((evmCoinInstance) => [evmCoinInstance[EntityMetaKey.SelectorKey], evmCoinInstance])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmCoinInstance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmCoinInstances.totalCount}
				getKey={(evmCoinInstance) => evmCoinInstance[EntityMetaKey.SelectorKey]}
				items={uniqueEvmCoinInstances}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM coin instances yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmCoinInstance })}
					{@const evmCoinInstanceFields = { ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }}
					{@const selection = select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const evmCoinInstanceHrefFields = { ...evmCoinInstance, ...evmCoinInstance[EntityMetaKey.Selector] }}
					<ProjectionBoundary
						resource={selection.NativeCurrency}
					>
						{#snippet Applicable()}
							<EvmCoinInstanceView
								selection={selection}
								prefetched={evmCoinInstanceFields}
								href={
									(evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstanceHrefFields.$network !== undefined && evmCoinInstanceHrefFields.$network.caip2 !== undefined && evmCoinInstanceHrefFields.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
										chainId: String(evmCoinInstanceHrefFields.$network.caip2.reference ?? ''),
										coinInstanceSlug: String('native' ?? ''),
									}) : evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstanceHrefFields.$contract !== undefined && evmCoinInstanceHrefFields.$contract.address !== undefined && evmCoinInstanceHrefFields.$network !== undefined && evmCoinInstanceHrefFields.$network.caip2 !== undefined && evmCoinInstanceHrefFields.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
										coinInstanceSlug: String(evmCoinInstanceHrefFields.$contract.address ?? ''),
										chainId: String(evmCoinInstanceHrefFields.$network.caip2.reference ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
					</ProjectionBoundary>

					<ProjectionBoundary
						resource={selection.Erc20Token}
					>
						{#snippet Applicable()}
							<EvmCoinInstanceView
								selection={selection}
								prefetched={evmCoinInstanceFields}
								href={
									(evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstanceHrefFields.$network !== undefined && evmCoinInstanceHrefFields.$network.caip2 !== undefined && evmCoinInstanceHrefFields.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
										chainId: String(evmCoinInstanceHrefFields.$network.caip2.reference ?? ''),
										coinInstanceSlug: String('native' ?? ''),
									}) : evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstanceHrefFields.$contract !== undefined && evmCoinInstanceHrefFields.$contract.address !== undefined && evmCoinInstanceHrefFields.$network !== undefined && evmCoinInstanceHrefFields.$network.caip2 !== undefined && evmCoinInstanceHrefFields.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
										coinInstanceSlug: String(evmCoinInstanceHrefFields.$contract.address ?? ''),
										chainId: String(evmCoinInstanceHrefFields.$network.caip2.reference ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
					</ProjectionBoundary>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmCoinInstance}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
