<!-- Generated from APP.ts. -->

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

	const detailHref = $derived(
		resolve(
			'/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]',
			{
				userId: params.userId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


{#key params.userId}
	<ParentPageCollapsible
		href={detailHref}
	>
		{#snippet Summary()}
			<XUserView
				selection={
					select(EntityType.XUser, data.selector, {
						sources: [
							Source.X_Rest,
							Source.X_FxEmbed_Rest,
						],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
