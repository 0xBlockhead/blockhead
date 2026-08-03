<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterCastEmbed, {
		$cast: {
			fid: Number(params.fid),
			hash: params.hash,
		},
		indexInCast: Number(params.indexInCast),
	}, {
		sources: [
			Source.Snapchain_Rest,
		],
		fields: {
			title: true,
			url: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastEmbedView from '$/views/FarcasterCastEmbedView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Farcaster cast embed' : [(pageSelection.entity.title ?? ''), (pageSelection.entity.url ?? '')].filter(Boolean).join(' ') || 'Farcaster cast embed'} • Farcaster cast embed • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastEmbedView
		selection={pageSelection}
	/>
</Page>
