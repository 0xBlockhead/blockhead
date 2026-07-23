<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmCoinInstance>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmCoinInstance}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				type: true,
				$network: true,
				$contract: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmCoinInstances) => [...new Map(evmCoinInstances.values.map((evmCoinInstance) => [evmCoinInstance[EntityMetaKey.SelectorKey], evmCoinInstance])).values()]}
	getKey={(evmCoinInstance) => evmCoinInstance[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM coin instances yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmCoinInstance })}
		{@const selection = select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
		<ProjectionBoundary
			resource={selection.NativeCurrency}
		>
			{#snippet Applicable()}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								NativeCurrency: {
									fields: {
										symbol: true,
										name: true,
									},
								},
							},
						})
					}
				>
					{#snippet children(evmCoinInstanceProjection0)}
						{@const evmCoinInstanceFields = { ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance, ...evmCoinInstanceProjection0 }}
						<EntityView
							entityType={EntityType.EvmCoinInstance}
							entitySelector={evmCoinInstance[EntityMetaKey.Selector]}
							href={
								(
									evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency'
									&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
									&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
									&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
									&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
										resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
									chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
									coinInstanceSlug: String('native'),
								})
								:
										evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token'
										&& evmCoinInstance[EntityMetaKey.Selector] != null && '$contract' in evmCoinInstance[EntityMetaKey.Selector]
										&& evmCoinInstance[EntityMetaKey.Selector].$contract != null && 'address' in evmCoinInstance[EntityMetaKey.Selector].$contract
										&& evmCoinInstance[EntityMetaKey.Selector].$contract.address != null
										&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
										&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
										&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
										&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
											resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
										coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
										chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
									})
									:
										undefined
								)
							}
							layout={EntityLayout.Summary}
							open={false}
							showTypeAnnotation={false}
						>
							{#snippet Title()}
								{'EVM coin instance'}
							{/snippet}
						</EntityView>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Erc20Token}
		>
			{#snippet Applicable()}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								Erc20Token: {
									fields: {
										symbol: true,
										name: true,
									},
								},
							},
						})
					}
				>
					{#snippet children(evmCoinInstanceProjection1)}
						{@const evmCoinInstanceFields = { ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance, ...evmCoinInstanceProjection1 }}
						<EntityView
							entityType={EntityType.EvmCoinInstance}
							entitySelector={evmCoinInstance[EntityMetaKey.Selector]}
							href={
								(
									evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency'
									&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
									&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
									&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
									&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
										resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
									chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
									coinInstanceSlug: String('native'),
								})
								:
										evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token'
										&& evmCoinInstance[EntityMetaKey.Selector] != null && '$contract' in evmCoinInstance[EntityMetaKey.Selector]
										&& evmCoinInstance[EntityMetaKey.Selector].$contract != null && 'address' in evmCoinInstance[EntityMetaKey.Selector].$contract
										&& evmCoinInstance[EntityMetaKey.Selector].$contract.address != null
										&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
										&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
										&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
										&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
											resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
										coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
										chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
									})
									:
										undefined
								)
							}
							layout={EntityLayout.Summary}
							open={false}
							showTypeAnnotation={false}
						>
							{#snippet Title()}
								{'EVM coin instance'}
							{/snippet}
						</EntityView>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntitiesList>
