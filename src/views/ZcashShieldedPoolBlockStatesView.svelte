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
		title = 'Zcash shielded pool block states',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZcashShieldedPoolBlockStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ZcashShieldedPoolBlockState>
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
	import ZcashShieldedPoolBlockStateView from '$/views/ZcashShieldedPoolBlockStateView.svelte'
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
					finalRoot: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZcashShieldedPoolBlockState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(zcashShieldedPoolBlockStates)}
			{@const uniqueZcashShieldedPoolBlockStates = [...new Map(zcashShieldedPoolBlockStates.values.map((zcashShieldedPoolBlockState) => [zcashShieldedPoolBlockState[EntityMetaKey.SelectorKey], zcashShieldedPoolBlockState])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZcashShieldedPoolBlockState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={zcashShieldedPoolBlockStates.totalCount}
				getKey={(zcashShieldedPoolBlockState) => zcashShieldedPoolBlockState[EntityMetaKey.SelectorKey]}
				items={uniqueZcashShieldedPoolBlockStates}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Zcash shielded pool block states yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: zcashShieldedPoolBlockState }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ZcashShieldedPoolBlockState> })}
					{@const zcashShieldedPoolBlockStateFields = { ...zcashShieldedPoolBlockState[EntityMetaKey.Selector], ...zcashShieldedPoolBlockState }}
					<ZcashShieldedPoolBlockStateView
						selection={select(EntityType.ZcashShieldedPoolBlockState, zcashShieldedPoolBlockState[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={zcashShieldedPoolBlockStateFields}
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
		entityType={EntityType.ZcashShieldedPoolBlockState}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
