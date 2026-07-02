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
		title = 'ERC-4337 paymasters',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading ERC-4337 paymasters...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Paymasters-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Erc4337Paymaster>
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
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
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
					address: true,
					$network: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337Paymaster}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(erc4337Paymasters)}
			{@const uniqueErc4337Paymasters = [...new Map(erc4337Paymasters.values.map((erc4337Paymaster) => [erc4337Paymaster[EntityMetaKey.SelectorKey], erc4337Paymaster])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337Paymaster}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={erc4337Paymasters.values.length === uniqueErc4337Paymasters.length && erc4337Paymasters.totalCount != null && erc4337Paymasters.totalCount >= uniqueErc4337Paymasters.length ? erc4337Paymasters.totalCount : uniqueErc4337Paymasters.length}
				getKey={(erc4337Paymaster) => erc4337Paymaster[EntityMetaKey.SelectorKey]}
				items={uniqueErc4337Paymasters}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ERC-4337 paymasters yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: erc4337Paymaster }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Erc4337Paymaster> })}
					<Erc4337PaymasterView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/paymaster/[address=evmAddress]', {
								caip2: `${String(({ ...erc4337Paymaster.entitySelector, ...erc4337Paymaster }).caip2.namespace)}:${String(({ ...erc4337Paymaster.entitySelector, ...erc4337Paymaster }).caip2.reference)}`,
								address: String(({ ...erc4337Paymaster.entitySelector, ...erc4337Paymaster }).address),
							})
						}
						selection={select(EntityType.Erc4337Paymaster, erc4337Paymaster.entitySelector)}
						prefetched={erc4337Paymaster}
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
		entityType={EntityType.Erc4337Paymaster}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
