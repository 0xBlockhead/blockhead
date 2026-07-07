<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


<Page>
	<SpecificationRealmView
		href={
			resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
				specificationRealmSlug: params.specificationRealmSlug,
			})
		}
		selection={
			select(EntityType.SpecificationRealm, {
				realm: specificationRealmBySlug[params.specificationRealmSlug].id,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					label: true,
					labelPlural: true,
					slug: true,
				},
			})
		}
	/>
</Page>
