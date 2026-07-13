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

	const pageSelection = $derived(select(EntityType.BlockheadFarcasterAccountConnection, {
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
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.displayName) ?? ''), String((pageSelection.entitySelector.username) ?? ''), String((pageSelection.entitySelector.fid) ?? '')].filter(Boolean).join(' ') || 'Blockhead Farcaster account connection' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).displayName) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).username) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).fid) ?? '')].filter(Boolean).join(' ') || 'Blockhead Farcaster account connection'))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Blockhead Farcaster account connection • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadFarcasterAccountConnectionView
		href={
			resolve('/farcaster/account/[accountId=nonNegativeInteger]', {
				accountId: params.accountId,
			})
		}
		selection={pageSelection}
	/>
</Page>
