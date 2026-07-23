<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Zero g service providers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGServiceProviders-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGServiceProvider>
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
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGServiceProvider}
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
				providerId: true,
				serviceKind: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGServiceProviders) => [...new Map(zeroGServiceProviders.values.map((zeroGServiceProvider) => [zeroGServiceProvider[EntityMetaKey.SelectorKey], zeroGServiceProvider])).values()]}
	getKey={(zeroGServiceProvider) => zeroGServiceProvider[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g service providers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGServiceProvider })}
		{@const zeroGServiceProviderFields = { ...zeroGServiceProvider[EntityMetaKey.Selector], ...zeroGServiceProvider }}
		<EntityView
			entityType={EntityType.ZeroGServiceProvider}
			entitySelector={zeroGServiceProvider[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zeroGServiceProviderFields.providerId) ?? '')].filter(Boolean).join(' ') || 'zero g service provider'}
			{/snippet}

			{#snippet Value()}
				{[String((zeroGServiceProviderFields.serviceKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((zeroGServiceProviderFields.$network.name) ?? '')].filter(Boolean).join(' ') || [zeroGServiceProviderFields.$network.caip2 == null ? '' : String(`${(zeroGServiceProviderFields.$network.caip2).namespace}:${(zeroGServiceProviderFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
