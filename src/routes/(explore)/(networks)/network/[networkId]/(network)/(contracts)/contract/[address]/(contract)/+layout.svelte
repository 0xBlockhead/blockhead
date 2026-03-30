<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { stringify } from 'devalue'
	import type { LayoutProps } from './$types'


	// State
	let {
		children,
		params,
	}: LayoutProps = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Contract'}
	href={resolve('/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]', params)}
	id={stringify({ chainId: Number(params.networkId) })}
>
	{@render children()}
</ParentPageCollapsible>
