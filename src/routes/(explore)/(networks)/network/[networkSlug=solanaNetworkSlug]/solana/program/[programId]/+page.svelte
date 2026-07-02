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


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<svelte:head>
	<title>solana program • Blockhead</title>
</svelte:head>


<Page>
	<SolanaProgramView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/program/[programId]', {
				networkSlug: params.networkSlug,
				programId: params.programId,
			})
		}
		selection={
			select(EntityType.SolanaProgram, data.selector, {
				fields: {
					name: true,
					$programAccount: true,
					$upgradeAuthority: true,
				},
			})
		}
	/>
</Page>
