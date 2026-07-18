<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


{#key [params.namespace, params.target].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/[namespace=ipfsNamespace]/[target=stringSegment]', {
				namespace: params.namespace,
				target: params.target,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = IpfsResourceView}

			<DetailView
				selection={select(EntityType.IpfsResource, data.selector, { sources: [
		Source.Ipfs_Rest,
	] })}
				href={
					resolve('/[namespace=ipfsNamespace]/[target=stringSegment]', {
						namespace: params.namespace,
						target: params.target,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
