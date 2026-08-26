<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterCast, {
		hash: params.hash,
	}, {
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
			Source.Farcaster_Rest,
		],
		fields: {
			text: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.hash ?? '') || 'Farcaster cast' : [(pageSelection.entity.text ?? ''), pageSelection.entitySelector.hash].filter(Boolean).join(' ') || 'Farcaster cast'} • Farcaster cast • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastView
		selection={pageSelection}
	/>
</Page>
