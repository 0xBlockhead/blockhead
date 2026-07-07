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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<Page>
	<FarcasterUserView
		href={
			resolve('/(social)/(farcaster)/farcaster/user/[userId=farcasterFid]', {
				userId: params.userId,
			})
		}
		selection={
			select(EntityType.FarcasterUser, {
				fid: Number(params.userId),
			}, {
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
			})
		}
	/>
</Page>
