<script lang="ts">
	// Types/constants
	import type { NavigationItem } from '$/routes/NavigationItem.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { SvelteMap } from 'svelte/reactivity'


	// Context
	import { preloadData } from '$app/navigation'
	import { resolve } from '$app/paths'


	// State
	let {
		items,
		currentPathname,
	}: {
		items: NavigationItem[]
		currentPathname?: string
	} = $props()


	// Functions
	const navIconProps = (iconRef: string) => (
		/^data:|^\/\^http/.test(iconRef) ?
			{ src: iconRef }
		:
			{ icon: iconRef }
	)


	let searchValue = $state(
		'',
	)

	let treeOpenState = $state(
		new SvelteMap<string, boolean>(),
	)


	// (Derived)
	const searchFilter = $derived(
		searchValue.trim().toLowerCase(),
	)


	// Components
	import Icon from '$/components/Icon.svelte'
	import SearchableText from '$/components/SearchableText.svelte'
	import Tree from '$/components/Tree.svelte'
	import EntityId from '$/components/EntityId.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<search
	aria-label="Site navigation tree (addresses show EL chain id; markets, MEV-Boost deliveries, bridges, fork trains live in subtrees)"
	class="nav-items"
	data-column="gap-3"
>
	<input
		aria-controls="navigation-tree"
		type="search"
		data-sticky
		bind:value={searchValue}
		placeholder="Search... (⌘+K)"
		{@attach (element) => {
			const abortController = new AbortController()

			let lastFocusedElement: HTMLElement | undefined

			globalThis.addEventListener(
				'keydown',
				(event) => {
					if (
						(event.metaKey || event.ctrlKey) &&
						event.key.toLowerCase() === 'k'
					) {
						event.preventDefault()

						if (document.activeElement instanceof HTMLElement)
							lastFocusedElement = document.activeElement

						element.focus()
					}
				},
				{ signal: abortController.signal },
			)

			element.addEventListener(
				'blur',
				() => {
					lastFocusedElement?.focus()
					lastFocusedElement = undefined
				},
				{ signal: abortController.signal },
			)

			return () => {
				abortController.abort()
				lastFocusedElement?.focus()
				lastFocusedElement = undefined
			}
		}}
		onkeyup={(event) => {
			if (event.key === 'Escape') event.currentTarget.blur()
		}}
	/>

	<Tree
		{items}
		getKey={(item) => item.id}
		getChildren={(item) => item.children ?? item.allChildren}
		getIsOpen={(item) => treeOpenState.get(item.id) ?? (item.defaultIsOpen ?? false)}
		onIsOpenChange={(item, open) => {
			treeOpenState.set(item.id, open)
		}}
		getIsHidden={(item, getIsHidden) => (
			!!searchFilter
			&& !item.title.toLowerCase().includes(searchFilter)
			&& ((item.children ?? item.allChildren)?.every((child) => getIsHidden(child, getIsHidden)) ?? true)
		)}
		listTag="menu"
		listAttrs={{
			id: 'navigation-tree',
			'data-column': 'gap-0',
		}}
		detailsAttrs={{ 'data-sticky-container': '' }}
		summaryAttrs={{ 'data-sticky': '', 'data-row': 'start gap-2' }}
	>
		{#snippet Content({ node })}
			{#if node.href && node.address}
				{@const address = node.address}
				{@const navHref = node.href}
				<span
					data-row="start"
					aria-current={currentPathname === node.href ? 'page' : undefined}
				>
					<span
						data-row="start inline"
						data-row-item="flexible"
					>
						{#if address.network}
							<EntityId
								entityType={EntityType.EvmNetworkAccount}
								entitySelector={{
									$network: {
										caip2: {
											namespace: 'eip155',
											reference: String(address.network.chainId),
										},
									},
									$actor: { address: address.address },
								}}
								href={navHref}
							>
								{#snippet children()}
									<TruncatedValue value={address.address} />
								{/snippet}
							</EntityId>
						{:else}
							<EntityId
								entityType={EntityType.EvmAccount}
								entitySelector={{ address: address.address }}
								href={navHref}
							>
								{#snippet children()}
									<TruncatedValue value={address.address} />
								{/snippet}
							</EntityId>
						{/if}
					</span>

					{#if node.tag || node.manualWatch}
						<span data-row="start gap-1">
							{#if node.tag}
								<span
									data-tag={node.tag}
									data-row="start gap-1"
								>
									{#if node.tagIcon}
										<Icon
											{...navIconProps(node.tagIcon)}
											size="1em"
										/>
									{/if}

									{node.tag}
								</span>
							{/if}

							{#if node.manualWatch}
								<Icon
									icon="★"
									label="Pinned"
									size="1em"
								/>
							{/if}
						</span>
					{/if}
				</span>
			{:else if node.href}
				{@const navHref = node.href}
				<a
					href={resolve(navHref as '/')}
					data-row="start"
					aria-current={currentPathname === node.href ? 'page' : undefined}
					onmouseenter={() => {
						if (navHref && !navHref.startsWith('http')) {
							preloadData(navHref)
						}
					}}
					{...navHref.startsWith('http') && {
						target: '_blank',
						rel: 'noopener noreferrer',
					}}
				>
					<span
						data-row="start inline"
						data-row-item="flexible"
					>
						{#if node.icon}
							<Icon
								{...navIconProps(node.icon)}
								size="1em"
							/>
						{/if}

						<SearchableText
							text={node.title}
							query={searchFilter}
						/>
					</span>

					{#if node.tag || node.manualWatch}
						<span data-row="start gap-1">
							{#if node.tag}
								<span
									data-tag={node.tag}
									data-row="start gap-1"
								>
									{#if node.tagIcon}
										<Icon
											{...navIconProps(node.tagIcon)}
											size="1em"
										/>
									{/if}

									{node.tag}
								</span>
							{/if}

							{#if node.manualWatch}
								<Icon
									icon="★"
									label="Pinned"
									size="1em"
								/>
							{/if}
						</span>
					{/if}
				</a>
			{:else}
				{@const address = node.address}
				<span data-row="start">
					<span
						data-row="start inline"
						data-row-item="flexible"
					>
						{#if address?.network}
							<EntityId
								entityType={EntityType.EvmNetworkAccount}
								entitySelector={{
									$network: {
										caip2: {
											namespace: 'eip155',
											reference: String(address.network.chainId),
										},
									},
									$actor: { address: address.address },
								}}
							>
								{#snippet children()}
									<TruncatedValue value={address.address} />
								{/snippet}
							</EntityId>
						{:else if address}
							<EntityId
								entityType={EntityType.EvmAccount}
								entitySelector={{ address: address.address }}
							>
								{#snippet children()}
									<TruncatedValue value={address.address} />
								{/snippet}
							</EntityId>
						{:else if node.icon}
							<Icon
								{...navIconProps(node.icon)}
								size="1em"
							/>
						{/if}

						{#if !address}
							<SearchableText
								text={node.title}
								query={searchFilter}
							/>
						{/if}
					</span>

					{#if node.tag || node.manualWatch}
						<span data-row="start gap-1">
							{#if node.tag}
								<span
									data-tag={node.tag}
									data-row="start gap-1"
								>
									{#if node.tagIcon}
										<Icon
											{...navIconProps(node.tagIcon)}
											size="1em"
										/>
									{/if}

									{node.tag}
								</span>
							{/if}

							{#if node.manualWatch}
								<Icon
									icon="★"
									label="Pinned"
									size="1em"
								/>
							{/if}
						</span>
					{/if}
				</span>
			{/if}
		{/snippet}
	</Tree>
</search>


<style>
	.nav-items {
		:global {
			menu {
				gap: 2px;
				list-style: none;
				font-size: 0.975em;

				li {
					display: grid;
				}
			}
		}

		:global(details[data-sticky-container]) {
			--sticky-marginBlockStart: 1.75rem;
			--sticky-paddingBlockStart: 0.5rem;
		}

		a {
			color: inherit;
			font-weight: inherit;

			&:hover {
				color: var(--accent);
				text-decoration: none;
			}

			&[aria-current] {
				background-color: var(--background-primary);
				font-weight: 700;
			}
		}

		:global(summary),
		a:not(:global(summary) a) {
			padding: 0.45rem 0.45rem;
			border-radius: 0.375rem;
			font-weight: 500;
			transition-property: opacity, scale, background-color, color, outline;

			&:hover:not(:has(a:hover)) {
				background-color: var(--background-primary);
				color: var(--accent);
			}

			&:focus {
				outline: 2px solid var(--accent);
				outline-offset: -1px;
			}

			&:active {
				background-color: var(--background-primary);
			}
		}

		:global(details:not([open]) > summary::after) {
			transform: perspective(100px) rotateX(180deg) rotate(-90deg);
		}

		:global(summary ~ *) {
			margin-inline-start: 1em;
			margin-block-start: 2px;
			padding-inline-start: 0.75em;
			box-shadow: -1px 0 var(--color-border);
		}
	}
</style>
