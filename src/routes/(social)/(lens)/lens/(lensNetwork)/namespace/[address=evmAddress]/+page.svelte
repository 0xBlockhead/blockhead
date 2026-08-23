<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensUsernameNamespaceView from '$/views/LensUsernameNamespaceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LensUsernameNamespace, data.selector, {
				fields: {
					namespace: true,
					tokenName: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Lens username namespace' : [pageSelection.entity.namespace, (pageSelection.entity.tokenName ?? '')].filter(Boolean).join(' ') || 'Lens username namespace')} • Lens username namespace • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lens username namespace'} • Lens username namespace • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LensUsernameNamespace, data.selector, {
				fields: {
					namespace: true,
					tokenName: true,
				},
			})}

	<LensUsernameNamespaceView
		selection={pageSelection}
	/>
	{/if}
</Page>
