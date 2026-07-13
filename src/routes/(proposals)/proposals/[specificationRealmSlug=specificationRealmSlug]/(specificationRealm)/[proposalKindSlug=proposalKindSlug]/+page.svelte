<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { proposalCategoryById } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SpecificationProposalKind, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			labelPlural: true,
			label: true,
			slug: true,
			$specificationRealm: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.labelPlural) ?? '')].filter(Boolean).join(' ') || [String((proposalCategoryById[String(pageSelection.entitySelector.category)]?.labelPlural ?? (String((pageSelection.entitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).labelPlural) ?? '')].filter(Boolean).join(' ') || [String((proposalCategoryById[String(({ ...pageSelection.entitySelector, ...pageSelection.entity }).category)]?.labelPlural ?? (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind')))


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationProposalKindView from '$/views/SpecificationProposalKindView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Specification proposal kind • Blockhead</title>
</svelte:head>


<Page>
	<SpecificationProposalKindView
		href={
			resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
				specificationRealmSlug: params.specificationRealmSlug,
				proposalKindSlug: params.proposalKindSlug,
			})
		}
		selection={pageSelection}
	/>
</Page>
