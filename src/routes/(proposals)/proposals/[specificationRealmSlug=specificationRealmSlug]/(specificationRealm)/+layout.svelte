<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


{#key params.specificationRealmSlug}
	<ParentPageCollapsible
		href={
			resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]', {
				specificationRealmSlug: params.specificationRealmSlug,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = SpecificationRealmView}

			<DetailView
				selection={select(EntityType.SpecificationRealm, data.selector)}
				href={
					resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]', {
						specificationRealmSlug: params.specificationRealmSlug,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
