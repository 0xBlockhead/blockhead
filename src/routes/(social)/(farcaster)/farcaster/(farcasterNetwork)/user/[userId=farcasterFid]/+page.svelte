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

	const pageSelection = $derived(select(EntityType.FarcasterUser, data.selector, {
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.displayName) ?? ''), String((pageSelection.entitySelector.username) ?? ''), String((pageSelection.entitySelector.fid) ?? '')].filter(Boolean).join(' ') || 'Farcaster user' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).displayName) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).username) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).fid) ?? '')].filter(Boolean).join(' ') || 'Farcaster user')))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Farcaster user • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterUserView
		href={
			resolve('/farcaster/user/[userId=farcasterFid]', {
				userId: params.userId,
			})
		}
		selection={pageSelection}
	/>
</Page>
