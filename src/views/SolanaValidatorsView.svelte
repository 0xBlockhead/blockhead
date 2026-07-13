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
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaValidators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaValidator>
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
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
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
					votePubkey: true,
					delinquent: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaValidator}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaValidators)}
			{@const uniqueSolanaValidators = [...new Map(solanaValidators.values.map((solanaValidator) => [solanaValidator[EntityMetaKey.SelectorKey], solanaValidator])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaValidator}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaValidators.totalCount}
				getKey={(solanaValidator) => solanaValidator[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaValidators}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana validators yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaValidator }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaValidator> })}
					{@const solanaValidatorFields = { ...solanaValidator[EntityMetaKey.Selector], ...solanaValidator }}
					{@const solanaValidatorHrefFields = { ...solanaValidator, ...solanaValidator[EntityMetaKey.Selector] }}
					<SolanaValidatorView
						selection={select(EntityType.SolanaValidator, solanaValidator[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={solanaValidatorFields}
						href={
							(solanaValidatorHrefFields.$network !== undefined && solanaValidatorHrefFields.$network.slug !== undefined && solanaValidatorHrefFields.votePubkey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
								network: String(solanaValidatorHrefFields.$network.slug ?? ''),
								validatorId: String(solanaValidatorHrefFields.votePubkey ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.SolanaValidator}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
