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
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


{#key params.did}
	<ParentPageCollapsible
		href={
			resolve('/atproto/actor/[did=stringSegment]', {
				did: params.did,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = AtprotoActorView}

			<DetailView
				selection={select(EntityType.AtprotoActor, data.selector, { sources: [
		Source.Atproto_Xrpc,
	] })}
				href={
					resolve('/atproto/actor/[did=stringSegment]', {
						did: params.did,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
