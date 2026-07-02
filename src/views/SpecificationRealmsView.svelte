<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SpecificationProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Specification realms',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Specification realms...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SpecificationRealms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SpecificationRealm>
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
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}


<ResourceBoundary
	resource={selection({
		limit: 512,
		fields: {
			label: true,
		},
	})}
	{placeholderText}
>
	{#snippet children(realms)}
		{#if realms.values.length === 0}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<CollapsibleTabs
				id={id}
				{open}
				sectionIdPrefix="proposal-realm"
				sections={[
					{ id: 'realms', label: title },
				]}
				data-card
				scrollContainerProps={{
					'data-scroll-container': 'block',
				}}
			>
				{#snippet Summary()}
					<div data-column="gap-1">
						<header
							data-row-item="flexible"
							data-row="wrap gap-4"
						>
							<Heading>
								{title}
							</Heading>
						</header>

						<div data-row="wrap align-center gap-2">
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Realms are top-level stewards for specification catalogs. Open a realm for document families, then numbered drafts.
									</p>
								{/snippet}

								<abbr
									class="entity-heading-tip"
									aria-label="How realms are grouped"
								>i</abbr>
							</Tooltip>
						</div>
					</div>
				{/snippet}

				{#snippet SectionRealms()}
					<div data-column="gap-4 layout-flex">
						{#each realms.values.toSorted((first, second) => (
							String(first.entitySelector.realm).localeCompare(String(second.entitySelector.realm))
						)) as realm (String(realm.entitySelector.realm))}
							<section data-scroll-marker-label={String(realm.entitySelector.realm)}>
								<SpecificationRealmView
									selection={select(
										EntityType.SpecificationRealm,
										{ realm: realm.entitySelector.realm }
									)}
									href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
										specificationRealmSlug: String(specificationRealmById[String(realm.entitySelector.realm)].slug),
									})}
									layout={EntityLayout.Title}
									open={false}
									prefetched={realm}
								/>

								<SpecificationProposalKindsView
									collapsible={false}
									selection={select(
										EntityType.SpecificationRealm,
										{ realm: realm.entitySelector.realm }
									)[EntityProxyField]<EntityType.SpecificationProposalKind>('$$proposalKinds')}
									id={`proposal-realm:${String(realm.entitySelector.realm)}:proposal-kinds`}
									open
									title={String(realm.entitySelector.realm)}
								/>
							</section>
						{/each}
					</div>
				{/snippet}
			</CollapsibleTabs>
		{/if}
	{/snippet}
</ResourceBoundary>
