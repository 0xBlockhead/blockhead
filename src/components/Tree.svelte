<script module lang="ts">
	// Types/constants
	type ListTag = 'ul' | 'ol' | 'menu'
</script>


<script
	lang="ts"
	generics="
		_Node,
		_Key extends string | number = string | number
	"
>
	// Types/constants
	import type { Snippet } from 'svelte'
	import type { SvelteHTMLElements } from 'svelte/elements'

	type IsOpen = (node: _Node, isOpen: IsOpen) => boolean
	type IsHidden = (node: _Node, isHidden: IsHidden) => boolean


	// State
	let {
		items,
		getKey,
		getChildren,
		getIsOpen,
		onIsOpenChange,
		getIsHidden,
		Content,
		listTag = 'ul',
		listAttrs,
		detailsAttrs,
		summaryAttrs,
	}: {
		items: _Node[]
		getKey: (node: _Node) => _Key
		getChildren: (node: _Node) => _Node[] | undefined
		getIsOpen: IsOpen
		onIsOpenChange?: (node: _Node, open: boolean) => void
		getIsHidden?: IsHidden
		Content: Snippet<[{ node: _Node }]>
		listTag?: ListTag
		listAttrs?: Partial<SvelteHTMLElements[ListTag]>
		detailsAttrs?: Partial<SvelteHTMLElements['details']>
		summaryAttrs?: Partial<SvelteHTMLElements['summary']>
	} = $props()


	// Components
	import Tree from '$/components/Tree.svelte'
</script>


<svelte:element
	this={listTag}
	{...listAttrs}
>
	{#each items as node (getKey(node))}
		{@const childItems = getChildren(node)}

		<li
			{...getIsHidden && getIsHidden(node, getIsHidden) && {
				hidden: true,
				inert: true,
			}}
		>
			{#if childItems?.length}
				<details
					{...detailsAttrs}
					open={getIsOpen(node, getIsOpen)}
					ontoggle={(e: Event & { currentTarget: HTMLDetailsElement }) => {
						onIsOpenChange?.(node, e.currentTarget.open)
					}}
				>
					<summary {...summaryAttrs}>
						{@render Content({ node })}
					</summary>

					<Tree
						items={childItems}
						{getKey}
						{getChildren}
						{getIsOpen}
						{onIsOpenChange}
						{getIsHidden}
						{Content}
						{listTag}
						{listAttrs}
						{detailsAttrs}
						{summaryAttrs}
					/>
				</details>
			{:else}
				{@render Content({ node })}
			{/if}
		</li>
	{/each}
</svelte:element>
