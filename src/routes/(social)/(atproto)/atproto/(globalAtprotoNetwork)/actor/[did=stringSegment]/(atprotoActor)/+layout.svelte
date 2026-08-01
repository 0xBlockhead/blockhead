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
			'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
			{
				did: params.did,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


{#key params.did}
	<ParentPageCollapsible
		href={detailHref}
	>
		{#snippet Summary()}
			<AtprotoActorView
				selection={
					select(EntityType.AtprotoActor, data.selector, {
						sources: [
							Source.Atproto_Xrpc,
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
