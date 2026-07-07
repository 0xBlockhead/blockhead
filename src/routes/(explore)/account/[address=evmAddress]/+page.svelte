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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<Page>
	<EvmAccountView
		href={
			resolve('/(explore)/account/[address=evmAddress]', {
				address: params.address,
			})
		}
		selection={
			select(EntityType.EvmAccount, {
				address: params.address,
			}, {
				fields: {
					$avatar: true,
					avatarUrl: true,
					$primaryName: true,
				},
			})
		}
	/>
</Page>
