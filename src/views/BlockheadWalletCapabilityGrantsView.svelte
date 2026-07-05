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
		title = 'Wallet capability grants',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletCapabilityGrants-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadWalletCapabilityGrant>
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
	import BlockheadWalletCapabilityGrantView from '$/views/BlockheadWalletCapabilityGrantView.svelte'
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
					grantId: true,
					authorizationKind: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadWalletCapabilityGrants)}
			{@const uniqueBlockheadWalletCapabilityGrants = [...new Map(blockheadWalletCapabilityGrants.values.map((blockheadWalletCapabilityGrant) => [blockheadWalletCapabilityGrant[EntityMetaKey.SelectorKey], blockheadWalletCapabilityGrant])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadWalletCapabilityGrant}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadWalletCapabilityGrants.totalCount}
				getKey={(blockheadWalletCapabilityGrant) => blockheadWalletCapabilityGrant[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadWalletCapabilityGrants}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead wallet capability grants yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadWalletCapabilityGrant }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadWalletCapabilityGrant> })}
					{@const blockheadWalletCapabilityGrantFields = { ...blockheadWalletCapabilityGrant[EntityMetaKey.Selector], ...blockheadWalletCapabilityGrant }}
					<BlockheadWalletCapabilityGrantView
						selection={select(EntityType.BlockheadWalletCapabilityGrant, blockheadWalletCapabilityGrant[EntityMetaKey.Selector])}
						prefetched={blockheadWalletCapabilityGrantFields}
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
		entityType={EntityType.BlockheadWalletCapabilityGrant}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
