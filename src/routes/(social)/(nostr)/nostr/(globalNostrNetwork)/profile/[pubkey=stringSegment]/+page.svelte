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

	const pageSelection = $derived(select(EntityType.NostrProfile, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
		fields: {
			$latestMetadataEvent: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile' : [String((({ ...data.selector, ...pageSelection.entity }).pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile'))} • Nostr profile • Blockhead</title>
</svelte:head>


<Page>
	<NostrProfileView
		href={
			resolve('/nostr/profile/[pubkey=stringSegment]', {
				pubkey: params.pubkey,
			})
		}
		selection={pageSelection}
	/>
</Page>
