<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'

	const pageSelection = $derived(select(EntityType.FarcasterCast, {
		fid: 3,
		hash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
	}, {
		sources: [
			Source.Snapchain_Rest,
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			text: true,
			timestamp: true,
			$author: true,
			$channel: true,
			$parentCast: true,
			parentUrl: true,
			threadHash: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.text) ?? ''), String((pageSelection.entitySelector.hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).text) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast'))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Farcaster cast • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastView
		href={resolve('/farcaster/open-cast')}
		selection={pageSelection}
	/>
</Page>
