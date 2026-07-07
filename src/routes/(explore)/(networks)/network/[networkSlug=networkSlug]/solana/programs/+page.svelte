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
	import SolanaProgramsView from '$/views/SolanaProgramsView.svelte'
</script>


<svelte:head>
	<title>Solana programs • Blockhead</title>
</svelte:head>


<Page>
	<SolanaProgramsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/programs', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana programs'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			})[EntityProxyField]<EntityType.SolanaProgram>('$$solanaPrograms')
		}
		id='solana-programs'
	/>
</Page>
