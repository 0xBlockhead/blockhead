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
	import UrlView from '$/views/UrlView.svelte'
</script>


{#key params.url}
	<ParentPageCollapsible
		href={
			resolve(
				'/(explore)/url/[url=absoluteUrl]',
				{
					url: String(params.url),
				}
			)
		}
	>
		{#snippet Summary()}
			<UrlView
				selection={select(EntityType.Url, data.selector)}
				href={
					resolve(
						'/(explore)/url/[url=absoluteUrl]',
						{
							url: String(params.url),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
