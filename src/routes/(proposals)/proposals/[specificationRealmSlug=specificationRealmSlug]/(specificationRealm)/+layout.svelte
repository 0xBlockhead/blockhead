<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
			resolve(
				'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
				{
					specificationRealmSlug: String(params.specificationRealmSlug),
				}
			)
		}
	>
		{#snippet Summary()}
			<SpecificationRealmView
				selection={
					select(EntityType.SpecificationRealm, data.selector, { sources: [
						Source.Constants_Internal,
					] })
				}
				href={
					resolve(
						'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
						{
							specificationRealmSlug: String(params.specificationRealmSlug),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
