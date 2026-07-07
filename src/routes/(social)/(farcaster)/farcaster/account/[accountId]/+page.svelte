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
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<Page>
	<BlockheadFarcasterAccountConnectionView
		href={
			resolve('/(social)/(farcaster)/farcaster/account/[accountId]', {
				accountId: params.accountId,
			})
		}
		selection={
			select(EntityType.BlockheadFarcasterAccountConnection, {
				fid: Number(params.accountId),
			}, {
				sources: [
					Source.Local_Internal,
					Source.Neynar_Rest,
					Source.Snapchain_Rest,
				],
				fields: {
					$icon: true,
					displayName: true,
					username: true,
					custody: true,
					authMethod: true,
					signedAt: true,
					bio: true,
				},
			})
		}
	/>
</Page>
