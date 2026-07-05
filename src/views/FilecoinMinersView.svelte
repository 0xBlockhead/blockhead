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
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Filecoin miners',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinMiners-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FilecoinMiner>
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
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
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
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
				fields: {
					minerAddress: true,
					qualityAdjustedPower: true,
					peerId: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(filecoinMiners)}
			{@const uniqueFilecoinMiners = [...new Map(filecoinMiners.values.map((filecoinMiner) => [filecoinMiner[EntityMetaKey.SelectorKey], filecoinMiner])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FilecoinMiner}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={filecoinMiners.totalCount}
				getKey={(filecoinMiner) => filecoinMiner[EntityMetaKey.SelectorKey]}
				items={uniqueFilecoinMiners}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Filecoin miners yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: filecoinMiner }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FilecoinMiner> })}
					{@const filecoinMinerFields = { ...filecoinMiner[EntityMetaKey.Selector], ...filecoinMiner }}
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
						prefetched={filecoinMinerFields}
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
		entityType={EntityType.FilecoinMiner}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
