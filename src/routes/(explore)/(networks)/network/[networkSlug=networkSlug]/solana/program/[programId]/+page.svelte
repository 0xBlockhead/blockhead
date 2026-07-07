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
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<Page>
	<SolanaProgramView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/program/[programId]', {
				networkSlug: params.networkSlug,
				programId: params.programId,
			})
		}
		selection={
			select(EntityType.SolanaProgram, {
				$network: {
					caip2: networkBySlug[params.networkSlug].caip2,
				},
				programId: decodeURIComponent(params.programId),
			}, {
				fields: {
					name: true,
					$programAccount: true,
					$upgradeAuthority: true,
				},
			})
		}
	/>
</Page>
