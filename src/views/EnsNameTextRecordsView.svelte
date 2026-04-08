<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { SvelteSet } from 'svelte/reactivity'

	let {
		entityId,
		href,
		open = $bindable(true),
		recordKeys = [],
	}: {
		entityId: EntityId<typeof schema, EntityType.EnsName>
		href: string
		open?: boolean
		recordKeys?: string[]
	} = $props()

	const items = $derived.by(() => {
		const s = new SvelteSet<string>()
		for (const k of recordKeys) s.add(k)
		return s
	})

	const placeholderKeys = new SvelteSet<string>()

	const recordHref = (key: string) => (
		resolve(`/ens/name/${entityId.name}/record/${encodeURIComponent(key)}`)
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	title={'Text records'}
	{href}
	{open}
>
	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EnsName}
			{entityId}
		>
			<UnorderedList
				{items}
				getKey={(k) => k}
				getSortValue={(k) => k}
				{placeholderKeys}
			>
				{#snippet Item(
					props,
				)}
					{#if props.isPlaceholder}
						<span aria-hidden="true"></span>
					{:else}
						<a
							data-link
							href={recordHref(props.item)}
						>{props.item}</a>
					{/if}
				{/snippet}

				{#snippet Empty()}
					<p data-text="muted">No text records yet.</p>
				{/snippet}
			</UnorderedList>
		</EntityDetails>
	{/snippet}
</EntityView>
