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


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationProposalKindView from '$/views/SpecificationProposalKindView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((proposalCategoryById[String(data.selector.category)]?.labelPlural ?? (String((data.selector.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind' : [String((({ ...data.selector, ...pageSelection.entity }).labelPlural) ?? '')].filter(Boolean).join(' ') || [String((proposalCategoryById[String(({ ...data.selector, ...pageSelection.entity }).category)]?.labelPlural ?? (String((({ ...data.selector, ...pageSelection.entity }).category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind'))} • Specification proposal kind • Blockhead</title>
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
