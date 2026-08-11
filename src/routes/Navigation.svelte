<script lang="ts">
	// Types/constants
	import type { NavigationItem } from '$/routes/NavigationItem.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let {
		navigationItems,
	}: {
		navigationItems: NavigationItem[]
	} = $props()


	// Components
	import NavigationItems from '$/views/NavigationItem.svelte'
	import NetworkEnvironmentInput from '$/views/NetworkEnvironmentInput.svelte'
	import ProfileSwitcher from '$/views/ProfileSwitcher.svelte'
</script>


<nav
	id="nav"
	class="nav layout-nav"
	data-scroll-item="pane-static"
	data-scroll-container
	data-sticky-container
>
	<header
		data-sticky="block"
		data-row
	>
		<div
			data-row="start"
			data-row-item="flexible"
		>
			<a
				href={resolve('/')}
				aria-label="Home"
				data-row="start gap-0"
			>
				<span
					data-card="padding-2"
					data-row="gap-1"
				>
					<span class="title">
						Blockhead
					</span>
					<span data-badge>
						v0.1
					</span>
				</span>
			</a>
		</div>

		<menu data-row>
			<li>
				<button
					type="button"
					id="menu-toggle"
					aria-label="Skip to main content"
					onclick={() => globalThis.location.assign('#main')}
				>
					☰
				</button>
			</li>
		</menu>
	</header>

	<div
		id="nav-menu"
		data-sticky-container
	>
		<form
			class="entity-search"
			action={resolve('/open')}
			method="get"
			data-column="gap-1"
		>
			<label for="entity-search-input">Open an entity</label>

			<div data-row="gap-1">
				<input
					id="entity-search-input"
					name="q"
					type="search"
					placeholder="eip155:1 or example.eth"
					autocomplete="off"
					enterkeyhint="go"
					required
					aria-describedby="entity-search-help"
				/>

				<button type="submit">Open</button>
			</div>

			<small id="entity-search-help">
				CAIP-2, CAIP-10, URL, ENS, AT Protocol post, IPFS, or magnet URI
			</small>
		</form>

		<NavigationItems
			items={navigationItems}
			currentPathname={page.url.pathname}
		/>
	</div>

	<footer
		data-sticky
		data-column="gap-2"
	>
		<div data-row="align-center">
			<ProfileSwitcher />

			<NetworkEnvironmentInput />
		</div>
	</footer>
</nav>


<style>
	nav {
		view-transition-name: Nav;

		width: 100%;
		height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr auto;

		&[data-sticky-container] {
			--sticky-paddingBlockStart: var(--navigation-mobile-blockSize);
		}

		> header {
			block-size: var(--navigation-mobile-blockSize);
			box-shadow: 0 0 0 var(--separator-width) var(--border-color);

			padding: 1rem;

			a {
				display: flex;
				text-decoration: none;

				[data-card] {
					--bevel-highlight: light-dark(
						color-mix(in srgb, var(--color-bg) 92%, white),
						color-mix(in srgb, var(--color-bg) 95%, white)
					);
					--bevel-shadow: light-dark(
						color-mix(in srgb, var(--color-bg) 95%, black),
						color-mix(in srgb, var(--color-bg) 92%, black)
					);
					background: linear-gradient(
						145deg,
						var(--bevel-highlight) 0%,
						var(--card-backgroundColor) 50%,
						var(--bevel-shadow) 100%
					);
					box-shadow:
						inset 1px 1px 0 var(--bevel-highlight),
						inset -1px -1px 0 var(--bevel-shadow);
					font-size: 1.1em;
					text-transform: uppercase;

					.title {
						letter-spacing: 0.08em;
						font-weight: 700;
					}

					[data-badge] {
						letter-spacing: 0.06em;
						font-size: 0.6em;
					}
				}
			}

			menu {
				li {
					display: contents;
				}
			}
		}

		#nav-menu {
			padding: 1rem 0.75rem;

			.entity-search {
				padding-block-end: 1rem;

				label {
					font-weight: 600;
				}

				input {
					min-inline-size: 0;
					font-size: 1rem;
				}

				small {
					min-block-size: 1lh;
				}
			}

			&[data-sticky-container] {
				--sticky-marginBlockStart: 1rem;
				--sticky-marginBlockEnd: 1rem;
				--sticky-marginInlineStart: 0.75rem;
				--sticky-marginInlineEnd: 0.75rem;

				--sticky-paddingBlockStart: 5rem;
			}
		}

		footer {
			padding: 1rem;
		}
	}

</style>
