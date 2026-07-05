<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


<svelte:head>
	<title>Specification realm • Blockhead</title>
</svelte:head>


<Page>
	<SpecificationRealmView
		href={
			resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
				specificationRealmSlug: params.specificationRealmSlug,
			})
		}
		selection={
			select(EntityType.SpecificationRealm, data.selector, {
				fields: {
					label: true,
					labelPlural: true,
					slug: true,
				},
			})
		}
	/>
</Page>
