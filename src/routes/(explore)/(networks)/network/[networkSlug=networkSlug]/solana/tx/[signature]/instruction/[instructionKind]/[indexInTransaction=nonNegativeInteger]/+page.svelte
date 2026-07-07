<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { networkBySlug } from '$/constants/Network.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaInstructionView from '$/views/SolanaInstructionView.svelte'
</script>


<Page>
	<SolanaInstructionView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]', {
				networkSlug: params.networkSlug,
				signature: params.signature,
				instructionKind: params.instructionKind,
				indexInTransaction: params.indexInTransaction,
			})
		}
		selection={
			select(EntityType.SolanaInstruction, {
				$transaction: {
					$network: {
						caip2: networkBySlug[params.networkSlug].caip2,
					},
					signature: decodeURIComponent(params.signature),
				},
				instructionKind: decodeURIComponent(params.instructionKind),
				indexInTransaction: Number(params.indexInTransaction),
			}, {
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
