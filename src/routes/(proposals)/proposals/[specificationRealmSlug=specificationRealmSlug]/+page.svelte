<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SpecificationRealm, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			label: true,
			labelPlural: true,
			slug: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.label) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.realm) ?? '')].filter(Boolean).join(' ') || 'Specification realm' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).label) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).realm) ?? '')].filter(Boolean).join(' ') || 'Specification realm')))


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Specification realm • Blockhead</title>
</svelte:head>


<Page>
	<SpecificationRealmView
		href={
			resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]', {
				specificationRealmSlug: params.specificationRealmSlug,
			})
		}
		selection={pageSelection}
	/>
</Page>
