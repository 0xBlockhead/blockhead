<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterCast, {
		username: params.fname,
		hashPrefix: params.hash,
	}, {
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
			Source.Farcaster_Rest,
		],
		fields: {
			text: true,
			hash: true,
			fid: true,
			timestamp: true,
			$author: true,
			$channel: true,
			$parentCast: true,
			parentUrl: true,
			rootParentUrl: true,
			threadHash: true,
			clientUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'Farcaster cast' : [(pageSelection.entity.text ?? ''), String(pageSelection.entity.hash)].filter(Boolean).join(' ') || 'Farcaster cast')} • Farcaster cast • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastView
		selection={pageSelection}
	/>
</Page>
