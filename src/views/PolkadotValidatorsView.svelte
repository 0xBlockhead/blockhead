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
		title = 'Validators',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Polkadot validators...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotValidators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotValidator>
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
	import PolkadotValidatorView from '$/views/PolkadotValidatorView.svelte'
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
					stashAccountId: true,
					$network: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotValidator}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(polkadotValidators)}
			{@const uniquePolkadotValidators = [...new Map(polkadotValidators.values.map((polkadotValidator) => [polkadotValidator[EntityMetaKey.SelectorKey], polkadotValidator])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotValidator}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotValidators.values.length === uniquePolkadotValidators.length && polkadotValidators.totalCount != null && polkadotValidators.totalCount >= uniquePolkadotValidators.length ? polkadotValidators.totalCount : uniquePolkadotValidators.length}
				getKey={(polkadotValidator) => polkadotValidator[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotValidators}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot validators yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotValidator }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotValidator> })}
					<PolkadotValidatorView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/validator/[stashAccountId]', {
								networkSlug: String(({ ...polkadotValidator.entitySelector, ...polkadotValidator }).$network.slug),
								stashAccountId: String(({ ...polkadotValidator.entitySelector, ...polkadotValidator }).stashAccountId),
							})
						}
						selection={select(EntityType.PolkadotValidator, polkadotValidator.entitySelector)}
						prefetched={polkadotValidator}
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
		entityType={EntityType.PolkadotValidator}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
