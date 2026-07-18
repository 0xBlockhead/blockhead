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
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


{#key params.eventId}
	<ParentPageCollapsible
		href={
			resolve('/nostr/note/[eventId=stringSegment]', {
				eventId: params.eventId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = NostrNoteView}

			<DetailView
				selection={select(EntityType.NostrNote, data.selector, { sources: [
		Source.Constants_Internal,
		Source.NostrBand_Rest,
		Source.Primal_Rest,
	] })}
				href={
					resolve('/nostr/note/[eventId=stringSegment]', {
						eventId: params.eventId,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
