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
	import SolanaInstructionView from '$/views/SolanaInstructionView.svelte'
</script>


<svelte:head>
	<title>solana instruction • Blockhead</title>
</svelte:head>


<Page>
	<SolanaInstructionView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]', {
				networkSlug: params.networkSlug,
				signature: params.signature,
				instructionKind: params.instructionKind,
				indexInTransaction: params.indexInTransaction,
			})
		}
		selection={
			select(EntityType.SolanaInstruction, data.selector, {
				fields: {
					parsedType: true,
					stackHeight: true,
					$program: true,
					data: true,
				},
			})
		}
	/>
</Page>
