<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterUser, data.selector, {
		sources: [
			Source.Snapchain_Rest,
		],
		fields: {
			$icon: true,
			displayName: true,
			username: true,
			url: true,
			$primaryEvmAccount: true,
			bio: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.fid ?? '') || 'Farcaster user' : [(pageSelection.entity.displayName ?? ''), (pageSelection.entity.username ?? ''), String(pageSelection.entitySelector.fid)].filter(Boolean).join(' ') || 'Farcaster user'))} • Farcaster user • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterUserView
		selection={pageSelection}
	/>
</Page>
