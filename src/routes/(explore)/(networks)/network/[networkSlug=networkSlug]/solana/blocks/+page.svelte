<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
</script>


<svelte:head>
	<title>Solana blocks • Blockhead</title>
</svelte:head>


<Page>
	<SolanaBlocksView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/blocks', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana blocks'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			})[EntityProxyField]<EntityType.SolanaBlock>('$$solanaBlocks')
		}
		id='solana-blocks'
	/>
</Page>
