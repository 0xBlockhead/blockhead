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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GitRefUpdateView from '$/views/GitRefUpdateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitRefUpdate, {
				$repository: data.selector,
				refName: params.refName,
				oldObjectId: params.oldObjectId,
				newObjectId: params.newObjectId,
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.refName || 'Git ref update')} • Git ref update • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git ref update'} • Git ref update • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitRefUpdate, {
				$repository: data.selector,
				refName: params.refName,
				oldObjectId: params.oldObjectId,
				newObjectId: params.newObjectId,
			})}

	<GitRefUpdateView
		selection={pageSelection}
	/>
	{/if}
</Page>
