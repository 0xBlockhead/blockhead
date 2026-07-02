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
		title = 'EVM coin instances',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading EVM coin instances...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmCoinInstances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmCoinInstance>
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
			selection.sources == null ? selection({
				fields: {
					$icon: true,
					symbol: true,
					name: true,
					$network: true,
				},
			}) : selection
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
				totalCount={evmCoinInstances.values.length === uniqueEvmCoinInstances.length && evmCoinInstances.totalCount != null && evmCoinInstances.totalCount >= uniqueEvmCoinInstances.length ? evmCoinInstances.totalCount : uniqueEvmCoinInstances.length}
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

				{#snippet Item({ item: evmCoinInstance }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmCoinInstance> })}
					<EvmCoinInstanceView
						href={
							resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
								chainId: String(({ ...evmCoinInstance.entitySelector, ...evmCoinInstance }).$network.caip2.reference),
								coinInstanceSlug: String(
									(
										({ ...evmCoinInstance.entitySelector, ...evmCoinInstance }).type === 'NativeCurrency' ?
											'native'
										:
											({ ...evmCoinInstance.entitySelector, ...evmCoinInstance }).$contract.address
									)
								),
							})
						}
						selection={select(EntityType.EvmCoinInstance, evmCoinInstance.entitySelector)}
						prefetched={evmCoinInstance}
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
		entityType={EntityType.EvmCoinInstance}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
