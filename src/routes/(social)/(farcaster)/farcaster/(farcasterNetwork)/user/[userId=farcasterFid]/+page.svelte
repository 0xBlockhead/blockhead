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
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.fid) ?? '')].filter(Boolean).join(' ') || 'Farcaster user' : [String((({ ...data.selector, ...pageSelection.entity }).displayName) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).username) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).fid) ?? '')].filter(Boolean).join(' ') || 'Farcaster user'))} • Farcaster user • Blockhead</title>
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
