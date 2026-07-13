<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SolanaProgram, data.selector, {
		fields: {
			name: true,
			$programAccount: true,
			$upgradeAuthority: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.programId) ?? '')].filter(Boolean).join(' ') || 'solana program' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).programId) ?? '')].filter(Boolean).join(' ') || 'solana program')))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • solana program • Blockhead</title>
</svelte:head>


<Page>
	<SolanaProgramView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
				network: params.network,
				programId: params.programId,
			})
		}
		selection={pageSelection}
	/>
</Page>
