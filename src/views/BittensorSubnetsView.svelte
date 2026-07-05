<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'Bittensor subnets',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BittensorSubnets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BittensorSubnet>
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
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
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
					name: true,
					netuid: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(bittensorSubnets)}
			{@const uniqueBittensorSubnets = [...new Map(bittensorSubnets.values.map((bittensorSubnet) => [bittensorSubnet[EntityMetaKey.SelectorKey], bittensorSubnet])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BittensorSubnet}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bittensorSubnets.totalCount}
				getKey={(bittensorSubnet) => bittensorSubnet[EntityMetaKey.SelectorKey]}
				items={uniqueBittensorSubnets}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bittensor subnets yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bittensorSubnet }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BittensorSubnet> })}
					{@const bittensorSubnetFields = { ...bittensorSubnet[EntityMetaKey.Selector], ...bittensorSubnet }}
					<BittensorSubnetView
						selection={select(EntityType.BittensorSubnet, bittensorSubnet[EntityMetaKey.Selector])}
						prefetched={bittensorSubnetFields}
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
		entityType={EntityType.BittensorSubnet}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
